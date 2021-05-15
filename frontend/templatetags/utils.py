from django.template import Library
register = Library()

@register.filter(name='add_attr')
def add_attr(field, css):
    attrs = {}
    subwidgets = []
    widget = field.field.widget
    if hasattr(widget, "widgets"):
        subwidgets = widget.widgets
    classes = field.field.widget.attrs.get('class', "")
    definition = css.split(',')
    for d in definition:
        if ':' not in d:
            if len(subwidgets) > 0:
                for subwidget in subwidgets:
                    subwidget.attrs["class"] = d + " " + subwidget.attrs.get("class", "")
            else:
                widget.attrs["class"] = d + " " + widget.attrs.get("class", "")

        else:
            key, val = d.split(':')
            if key == "class":
                if len(subwidgets)>0:
                    for subwidget in subwidgets:
                        subwidget.attrs[key] = val + " " + subwidget.attrs.get(key, "")

                else:
                    widget.attrs[key] = val + " " + widget.attrs.get(key, "")
            else:
                if len(subwidgets) > 0:
                    for subwidget in subwidgets:
                        subwidget.attrs[key] = val
                else:
                    widget.attrs[key] = val

    if len(subwidgets)> 0:
        widget.attrs = {}
    return field.as_widget()
