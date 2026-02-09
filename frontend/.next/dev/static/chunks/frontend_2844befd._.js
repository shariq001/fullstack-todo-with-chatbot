(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/auth/better-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authClient",
    ()=>authClient,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/better-auth/dist/client/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/better-auth/dist/client/vanilla.mjs [app-client] (ecmascript)");
;
const authClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthClient"])({
    baseURL: ("TURBOPACK compile-time value", "https://full-stack-todo-hazel.vercel.app") || "http://localhost:3000"
});
const __TURBOPACK__default__export__ = authClient;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/auth/auth-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthSession",
    ()=>clearAuthSession,
    "getSession",
    ()=>getSession,
    "getToken",
    ()=>getToken,
    "isAuthenticated",
    ()=>isAuthenticated,
    "isTokenExpired",
    ()=>isTokenExpired,
    "setSession",
    ()=>setSession,
    "setToken",
    ()=>setToken
]);
/**
 * Authentication utilities for Better Auth integration.
 * Tokens are stored in localStorage after login for use with the backend API.
 */ const TOKEN_KEY = 'auth-token';
const SESSION_KEY = 'auth-session';
const getToken = async ()=>{
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            return localStorage.getItem(TOKEN_KEY);
        }
        //TURBOPACK unreachable
        ;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};
const setToken = (token)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(TOKEN_KEY, token);
    }
};
const setSession = (session)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
};
const getSession = ()=>{
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            const data = localStorage.getItem(SESSION_KEY);
            return data ? JSON.parse(data) : null;
        }
        //TURBOPACK unreachable
        ;
    } catch  {
        return null;
    }
};
const isAuthenticated = async ()=>{
    const token = await getToken();
    if (!token) return false;
    return !isTokenExpired(token);
};
const isTokenExpired = (token)=>{
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch  {
        return true;
    }
};
const clearAuthSession = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/services/auth-service.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthService",
    ()=>AuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Better Auth service integration
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/auth/better-auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/auth/auth-utils.ts [app-client] (ecmascript)");
;
;
;
async function fetchAndStoreJWT() {
    try {
        // Fetch JWT from our custom endpoint (uses session cookie)
        const response = await fetch('/api/auth/jwt', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])(data.token);
                return data.token;
            }
        }
    } catch (error) {
        console.error('Failed to fetch JWT token:', error);
    }
    return null;
}
class AuthService {
    static async login(credentials) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authClient"].signIn.email(credentials);
            if (result.error) {
                throw new Error(result.error.message || 'Login failed');
            }
            if (result.data) {
                // Fetch JWT token for backend API calls
                const jwtToken = await fetchAndStoreJWT();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSession"])({
                    user: result.data.user,
                    token: jwtToken || result.data.token
                });
            }
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
    static async register(userData) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authClient"].signUp.email({
                email: userData.email,
                password: userData.password,
                name: userData.email.split('@')[0]
            });
            if (result.error) {
                throw new Error(result.error.message || 'Registration failed');
            }
            if (result.data) {
                // Fetch JWT token for backend API calls
                const jwtToken = await fetchAndStoreJWT();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSession"])({
                    user: result.data.user,
                    token: jwtToken || result.data.token
                });
            }
            return result;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    static async forgotPassword(email) {
        const baseURL = ("TURBOPACK compile-time value", "https://full-stack-todo-hazel.vercel.app") || "http://localhost:3000";
        const response = await fetch(`${baseURL}/api/auth/forget-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                redirectTo: '/reset-password'
            })
        });
        if (!response.ok) {
            throw new Error('Failed to send password reset email');
        }
        return response.json();
    }
    static async resetPassword(token, newPassword) {
        const baseURL = ("TURBOPACK compile-time value", "https://full-stack-todo-hazel.vercel.app") || "http://localhost:3000";
        const response = await fetch(`${baseURL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                newPassword
            })
        });
        if (!response.ok) {
            throw new Error('Failed to reset password');
        }
        return response.json();
    }
    static async logout() {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authClient"].signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthSession"])();
        }
    }
    static getCurrentSession() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
    }
    static async isAuthenticated() {
        const session = this.getCurrentSession();
        return !!session?.user;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/hooks/use-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
// Authentication hook for managing auth state
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/services/auth-service.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
;
;
;
const useAuth = ()=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuth.useEffect": ()=>{
            const checkAuthStatus = {
                "useAuth.useEffect.checkAuthStatus": async ()=>{
                    try {
                        const session = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].getCurrentSession();
                        if (session?.user && await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].isAuthenticated()) {
                            setUser(session.user);
                            setIsAuthenticated(true);
                        }
                    } catch (error) {
                        console.error('Auth check failed:', error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["useAuth.useEffect.checkAuthStatus"];
            checkAuthStatus();
        }
    }["useAuth.useEffect"], []);
    const login = async (credentials)=>{
        setLoading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].login(credentials);
            const session = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].getCurrentSession();
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const register = async (userData)=>{
        setLoading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].register(userData);
            const session = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].getCurrentSession();
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            }
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const logout = async ()=>{
        setLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].logout();
            setUser(null);
            setIsAuthenticated(false);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setLoading(false);
        }
    };
    return {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };
};
_s(useAuth, "t3k16qgmhfyCbNVI9l7314EIX+A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/auth/signup-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUpForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/hooks/use-auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function SignUpForm() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { register } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        // Validate email format
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register({
                email,
                password
            });
            // Redirect to chatbot on successful registration
            router.push('/chat');
            router.refresh(); // Refresh to update UI
        } catch (err) {
            setError('Registration failed. Email may already be in use.');
            console.error('Registration error:', err);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: "space-y-6",
        onSubmit: handleSubmit,
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-md bg-red-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-red-700",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/frontend/components/auth/signup-form.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "block text-sm font-medium text-gray-700",
                        children: "Email address"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "email",
                            name: "email",
                            type: "email",
                            autoComplete: "email",
                            required: true,
                            value: email,
                            onChange: (e)=>setEmail(e.target.value),
                            disabled: loading,
                            className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/auth/signup-form.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "password",
                        className: "block text-sm font-medium text-gray-700",
                        children: "Password"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "password",
                                name: "password",
                                type: showPassword ? "text" : "password",
                                autoComplete: "new-password",
                                required: true,
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                disabled: loading,
                                className: "appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500",
                                onClick: ()=>setShowPassword(!showPassword),
                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.707.707"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                        lineNumber: 104,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                            lineNumber: 108,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                            lineNumber: 109,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "confirmPassword",
                        className: "block text-sm font-medium text-gray-700",
                        children: "Confirm Password"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "confirmPassword",
                                name: "confirmPassword",
                                type: showConfirmPassword ? "text" : "password",
                                autoComplete: "new-password",
                                required: true,
                                value: confirmPassword,
                                onChange: (e)=>setConfirmPassword(e.target.value),
                                disabled: loading,
                                className: "appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500",
                                onClick: ()=>setShowConfirmPassword(!showConfirmPassword),
                                children: showConfirmPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.707.707"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    disabled: loading,
                    className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
                    children: loading ? 'Creating account...' : 'Create account'
                }, void 0, false, {
                    fileName: "[project]/frontend/components/auth/signup-form.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-600",
                        children: "Already have an account?"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/login",
                        className: "font-medium text-blue-600 hover:text-blue-500",
                        children: "Sign in"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/auth/signup-form.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/auth/signup-form.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/auth/signup-form.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(SignUpForm, "ctQ/8++gqlaz84EtEkkZghANj70=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = SignUpForm;
var _c;
__turbopack_context__.k.register(_c, "SignUpForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/signup/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignUpPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$auth$2f$signup$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/auth/signup-form.tsx [app-client] (ecmascript)");
'use client';
;
;
function SignUpPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sm:mx-auto sm:w-full sm:max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                    children: "Create a new account"
                }, void 0, false, {
                    fileName: "[project]/frontend/app/signup/page.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/signup/page.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$auth$2f$signup$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/frontend/app/signup/page.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/app/signup/page.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/signup/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/signup/page.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = SignUpPage;
var _c;
__turbopack_context__.k.register(_c, "SignUpPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_2844befd._.js.map