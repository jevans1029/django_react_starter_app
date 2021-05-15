from django.test import TestCase
from main.models import *
from django.contrib import auth
from django.core import mail


class LoginTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user("Test", email='example@gmail.com', password = 'BlahBlah1!')


    def test_login_success(self):
        response = self.client.post("/api/account/login/",
                                    data={"email": "example@gmail.com", "password": "BlahBlah1!"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue("success" in response.json().keys())
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated)

    def test_login_fail(self):
        response = self.client.post("/api/account/login/",
                                    data={"email": "fail@gmail.com", "password": "BlahBlah1!"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue("errors" in response.json().keys())
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated)


class SignupTest(TestCase):

    def create_user(self):
        self.user = User.objects.create_user("Test", email='example@gmail.com', password = 'BlahBlah1!')

    def post(self, email, password1, password2):
        return self.client.post("/api/account/signup/",
                                data={"email": email, "password": password1, "confirmpassword": password2})

    def test_successful_signup(self):
        response = self.post("example@gmail.com", "blahblah", "blahblah")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.all().count(), 1)
        self.assertEqual(len(mail.outbox), 1)
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated)

    def test_invalid_form_data(self):
        response = self.post("example@gmail.com", "blahbl", "blahbl")
        self.assertTrue("errors" in response.json().keys())
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated)
        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(User.objects.all().count(), 0)

        response = self.post("example@gmail.com", "blahblahblah", "blahbl")
        self.assertTrue("errors" in response.json().keys())
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated)
        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(User.objects.all().count(), 0)

        self.create_user()
        response = self.post("example@gmail.com", "blahblah", "blahblah")
        self.assertTrue("errors" in response.json().keys())
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated)
        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(User.objects.all().count(), 1)

class PasswordChangeTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user("Test", email='example@gmail.com', password = 'BlahBlah1!')

    def post(self, password1, password2):
        return self.client.post("/api/account/change_password/",
                                data={"password": password1, "confirmpassword": password2})

    def test_successful_change(self):
        self.client.login(username="example@gmail.com", password="BlahBlah1!")
        response = self.post("blahblah", "blahblah")
        self.assertEqual(response.status_code, 200)
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated)
        self.assertTrue(self.client.login(username="example@gmail.com", password="blahblah"))

    def test_fail_if_not_logged_in(self):
        response = self.post("blahblah", "blahblah")
        self.assertEqual(response.status_code, 403)

    def test_invalid_input(self):
        self.client.login(username="example@gmail.com", password="BlahBlah1!")
        response = self.post("blahblah", "blah")
        self.assertTrue("errors" in response.json().keys())

        response = self.post("blah", "blah")
        self.assertTrue("errors" in response.json().keys())

class SendResetEmail(TestCase):

    def setUp(self):
        self.user = User.objects.create_user("Test", email='example@gmail.com', password = 'BlahBlah1!')

    def post(self, email):
        return self.client.post("/api/account/reset_password/", data={"email": email})

    def test_send_email(self):
        response = self.post("example@gmail.com")
        self.assertEqual(len(mail.outbox), 1)

    def test_fail_send_email(self):
        response = self.post("test@gmail.com")
        self.assertEqual(len(mail.outbox), 0)