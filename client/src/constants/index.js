import { createCampaign, dashboard, logout, profile } from '../assets';

export const navlinks = [
    {
        name: 'logout',
        imgUrl: logout,
        link: '/registration',
        disabled: false,
    },
    {
        name: 'dashboard',
        imgUrl: dashboard,
        link: '/',
    },
    {
        name: 'create-grant',
        imgUrl: createCampaign,
        link: '/create-grant',
    },
    {
        name: 'profile',
        imgUrl: profile,
        link: '/profile',
    },


];

