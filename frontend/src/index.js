import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './app';

import { createTheme } from '@material-ui/core/styles';

const theme = createTheme();

render((
    <BrowserRouter>

        <App  />
    </BrowserRouter>
), document.getElementById('root'));