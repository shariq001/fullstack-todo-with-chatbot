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
    baseURL: ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000"
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
        const baseURL = ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000";
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
        const baseURL = ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000";
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
"[project]/frontend/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
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
function HomePage() {
    _s();
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (!loading) {
                if (isAuthenticated) {
                    // Redirect authenticated users to dashboard
                    router.push('/dashboard');
                }
            // Unauthenticated users stay on home page
            }
        }
    }["HomePage.useEffect"], [
        isAuthenticated,
        loading,
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/frontend/app/page.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/page.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-16",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md mx-auto text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl shadow-xl p-8 md:p-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-12 w-12 text-white",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 37,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 36,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 35,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4",
                                children: "Welcome to Todo App"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-8 text-lg",
                                children: "Organize your tasks and boost your productivity with our intuitive todo manager."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/login'),
                                        className: "w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-105",
                                        children: "Sign in to your account"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/signup'),
                                        className: "w-full py-3 px-6 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-lg shadow-md transition duration-200",
                                        children: "Create new account"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 pt-6 border-t border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500",
                                    children: "Join thousands of users managing their tasks efficiently"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/page.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-blue-500 mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-8 w-8 mx-auto",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.tsx",
                                                lineNumber: 77,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 76,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900",
                                        children: "Secure"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "End-to-end encryption"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-blue-500 mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-8 w-8 mx-auto",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M13 10V3L4 14h7v7l9-11h-7z"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.tsx",
                                                lineNumber: 87,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900",
                                        children: "Fast"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Lightning quick responses"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-blue-500 mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-8 w-8 mx-auto",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.tsx",
                                                lineNumber: 97,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-gray-900",
                                        children: "Easy"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Intuitive interface"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/page.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/page.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/page.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/page.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(HomePage, "hfJApfKdkCGjZCs1NVF94JuC2xc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_085917fb._.js.map