
import Cookies from 'js-cookie'

import { encryptObject } from "./crypto";

// export const setCookies = async (token, rememberMe, formValue) => {
//     if (rememberMe) {
//         Cookies.set("admin_token", token, { expires: 30 }); // 30-day cookie
//         const Encrypted = encryptObject(formValue);
//         Cookies.set("remember_me_hoppr", Encrypted, { expires: 2 }); // Track "remember me" 2 day
//     } else {
//         Cookies.set("admin_token", token);
//         Cookies.remove("remember_me_hoppr");
//     }

// }

export const setCookies = async (token, rememberMe, formValue, role) => {
    // Save the token
    Cookies.set("admin_token", token, rememberMe ? { expires: 30 } : undefined);

    // Save remember me info by role
    if (rememberMe) {
        const encrypted = encryptObject(formValue);

        if (role === 1) {
            Cookies.set("remember_me_admin", encrypted, { expires: 2 });
            Cookies.remove("remember_me_vendor");
        } else if (role === 2) {
            Cookies.set("remember_me_vendor", encrypted, { expires: 2 });
            Cookies.remove("remember_me_admin");
        }
    } else {
        Cookies.remove("remember_me_admin");
        Cookies.remove("remember_me_vendor");
    }
};

export const getAuthorizationHeader = () => {

    const token = Cookies.get('admin_token');
    if (token) {
        return token
    } else {
        return false
    }
}

export const clearCookies = () => {
    Cookies.remove('admin_token')
    window.location.reload()
}