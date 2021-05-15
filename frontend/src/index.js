import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './app';

import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

render((
    <BrowserRouter>
        <App  />
    </BrowserRouter>
), document.getElementById('root'));