"use client";

import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { TextField, Button, Grid, Paper, Typography, Box, Alert } from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useRouter } from "next/navigation";

const cacheRtl = createCache({
    key: "mui-rtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

async function getProfile(token) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/profile`,
            {
                cache: "no-store",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!res.ok) {
            throw new Error("خطا در دریافت اطلاعات پروفایل");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return { statusCode: 500, message: error.message };
    }
}

export default function EditProfileModule({ session }) {
    const router = useRouter();
    console.log(session)
    const { update } = useSession();
    const existingTheme = useTheme();
    const theme = React.useMemo(
        () => createTheme(existingTheme, { direction: "rtl" }),
        [existingTheme]
    );

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        nationalCode: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    // Fetch profile data when session is available
    useEffect(() => {
        async function fetchProfile() {
            if (session?.token) {
                setProfileLoading(true);
                const profileData = await getProfile(session.token);
                if (profileData?.statusCode === 200 && profileData.result) {
                    setFormData({
                        firstname: profileData.result.firstname || "",
                        lastname: profileData.result.lastname || "",
                        nationalCode: profileData.result.nationalCode || "",
                    });
                } else {
                    setError(profileData?.message || "خطا در بارگذاری اطلاعات پروفایل");
                }
                setProfileLoading(false);
            }
        }
        fetchProfile();
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        if (!formData.firstname || !formData.lastname || !formData.nationalCode) {
            setError("لطفاً تمام فیلدها را پر کنید");
            setLoading(false);
            return;
        }

        if (!/^\d{10}$/.test(formData.nationalCode)) {
            setError("کد ملی باید ۱۰ رقم باشد");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();
            console.log("Response data:", data);
            if (res.status === 201) {
                setSuccess(true);
                // Update session with new data
                await update({
                    result: {
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        nationalCode: formData.nationalCode,
                    },
                });
                // Refetch session to ensure client-side update
                const updatedSession = await getSession();
                console.log("Updated session:", updatedSession);
                // Update formData with new session data
                if (updatedSession?.result) {
                    setFormData({
                        firstname: updatedSession.result.firstname || "",
                        lastname: updatedSession.result.lastname || "",
                        nationalCode: updatedSession.result.nationalCode || "",
                    });
                }
                window.location.reload();

            } else {
                setError(data.message || "خطا در به‌روزرسانی پروفایل");
            }
        } catch (err) {
            setError("خطا در ارتباط با سرور");
        } finally {
            window.location.reload();
            setLoading(false);
        }
    };

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box dir="rtl" sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }} className="relative">
                    {(loading || profileLoading) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                                <span className="text-gray-700 font-medium">در حال بارگذاری...</span>
                            </div>
                        </div>
                    )}
                    <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
                        <Typography variant="h5" component="h1" gutterBottom align="center">
                            ویرایش پروفایل
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                پروفایل با موفقیت به‌روزرسانی شد
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="نام"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="medium"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="نام خانوادگی"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="medium"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="کد ملی"
                                        name="nationalCode"
                                        value={formData.nationalCode}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="medium"
                                        required
                                        inputProps={{ pattern: "\\d{10}", title: "کد ملی باید ۱۰ رقم باشد" }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={loading}
                                        sx={{ mt: 2 }}
                                    >
                                        {loading ? "در حال به‌روزرسانی..." : "ثبت تغییرات"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </ThemeProvider>
        </CacheProvider>
    );
}