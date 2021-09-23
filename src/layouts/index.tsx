import React from 'react';
import '../global.less'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {Sidebar} from "@/layouts/sidebar";
import {Content} from './content';

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    height: '100%'
}));

export default function () {
    return <Grid container spacing={2} className='container'>
        <Grid item xs={2}>
            <Item>
                <Sidebar/>
            </Item>
        </Grid>
        <Grid item xs={10}>
            <Item>
                <Content/>
            </Item>
        </Grid>
    </Grid>
}
