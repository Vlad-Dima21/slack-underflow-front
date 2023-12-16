const AccountRoutes = {
    get Login() {
        return 'login';
    },
    get SignUp() {
        return 'signup';
    },
    get all() {
        return [AccountRoutes.Login, AccountRoutes.SignUp];
    }
}

export default AccountRoutes;