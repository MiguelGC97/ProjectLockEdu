import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, Center, Checkbox, Divider, Flex, Input, PasswordInput, Stack } from "@mantine/core";
import classes from './SettingsBox.module.css';
import { IconMessageReport, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/hooks/AuthProvider";
import { updatePassword } from "@/services/fetch";
import bcrypt from "bcryptjs";

export function SettingsBox() {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [notificationsToUpdate, setNotificationsToUpdate] = useState<boolean>(false);
    const { user } = useAuth();
    const [visible, { toggle }] = useDisclosure(false);

    useEffect(() => {
        if (Notification.permission === "granted") {
            setNotificationsEnabled(true);
        } else {
            setNotificationsEnabled(false);
        }
    }, []);

    const checkPassword = useCallback(async (password: string) => {
        return await bcrypt.compare(password, user.password);
    }, [user]);

    const handleChangePassword = useCallback(async () => {
        try {
            const isCurrentPasswordValid = await checkPassword(currentPassword);
            if (!isCurrentPasswordValid) {
                console.error("Current password is incorrect");
                return;
            }
            await updatePassword(user, newPassword);
            console.log("Password changed successfully");
        } catch (error) {
            console.error("Error changing password", error);
        }
    }, [currentPassword, newPassword, checkPassword]);

    const subscribeToNotifications = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: "<Your VAPID Public Key>"
                    });
                    console.log("Usuario suscrito a notificaciones:", subscription);
                    setNotificationsEnabled(true);
                } else {
                    console.log("Permiso de notificaciones denegado");
                    setNotificationsEnabled(false);
                }
            }
        }
    };

    const unsubscribeNotifications = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) {
                    await subscription.unsubscribe();
                    console.log("Notificación desactivada (suscripción eliminada)");
                    setNotificationsEnabled(false);
                }
            }
        }
    };

    const handleNotificationToggle = async () => {
        if (notificationsToUpdate) {
            if (notificationsEnabled) {
                await unsubscribeNotifications();
            } else {
                await subscribeToNotifications();
            }
        }
    };

    return (
        <Box bg="transparent" h="80vh" style={{
            border: '1px solid var(--mantine-color-myPurple-1)',
            borderRadius: '83px 0 25px 25px',
            width: '100%'
        }}>
            <Center className={classes.banner} />
            <Divider size="xs" color="myPurple.1" />
            
            <Input readOnly variant="unstyled" size="lg" placeholder="Mi perfil" leftSection={<IconUser size={25} color="white" />} />
            <Divider size="xs" color="myPurple.1" />

            <Input readOnly variant="unstyled" size="lg" ml={60} placeholder="Cambiar contraseña" />
            <Divider size="xs" color="myPurple.1" />
            
            <Stack m={20} mb={50}>
                <PasswordInput
                    w={220}
                    ml={100}
                    label="Contraseña actual"
                    styles={{
                        label: {
                            color: 'white',
                            fontSize: '15px'
                        }
                    }}
                    visible={visible}
                    onVisibilityChange={toggle}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Flex justify="space-between" align="flex-end">
                    <PasswordInput
                        w={220}
                        ml={100}
                        styles={{
                            label: {
                                color: 'white',
                                fontSize: '15px'
                            }
                        }}
                        label="Nueva contraseña"
                        visible={visible}
                        onVisibilityChange={toggle}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button onClick={handleChangePassword} variant="filled" size="md" px="50" radius="xl" color="#483D8B">Enviar</Button>
                </Flex>
            </Stack>
            
            <Divider size="xs" color="myPurple.1" mt={30} />

            <Input readOnly variant="unstyled" size="lg" placeholder="Configuracion" leftSection={<IconMessageReport size={25} color="white" />} />
            <Divider size="xs" color="myPurple.1" />
            
            <Checkbox
                checked={notificationsEnabled}
                ml={50}
                mt={10}
                size="md"
                styles={{
                    label: {
                        color: 'white'
                    }
                }}
                label="Recibir notificaciones"
                color="white"
                iconColor="#191970"
                onChange={(event) => setNotificationsToUpdate(event.currentTarget.checked)}
            />
            <Button onClick={handleNotificationToggle} variant="filled" size="md" px="50" mt="24px" radius="xl" color="#483D8B">Aplicar</Button>
        </Box>
    );
}
