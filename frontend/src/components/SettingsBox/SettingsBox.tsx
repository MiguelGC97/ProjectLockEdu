import React, { useCallback, useState } from 'react';
import { IconMessageReport, IconPhotoPlus, IconUser } from '@tabler/icons-react';
import bcrypt from 'bcryptjs';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  FileInput,
  Flex,
  Input,
  PasswordInput,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/hooks/AuthProvider';
import instance, { baseUrl } from '@/services/api';
import { updateAvatar, updateOwnPassword, uploadAvatar } from '@/services/fetch';
import classes from './SettingsBox.module.css';

export function SettingsBox() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [visible, { toggle }] = useDisclosure(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showPasswordNotification, setShowPasswordNotification] = useState(false);
  const [showAvatarNotification, setShowAvatarNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const icon = <IconPhotoPlus size={18} stroke={1.5} />;
  const [file, setFile] = useState(null);

  const { user, notification, updateNotification, updateUserAvatar } = useAuth();

  const handleSaveNotifications = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1500);
  };

  const handleSavePassword = () => {
    setShowPasswordNotification(true);
    setTimeout(() => {
      setShowPasswordNotification(false);
    }, 1500);
  };

  const handleSaveAvatar = () => {
    setShowAvatarNotification(true);
    setTimeout(() => {
      setShowAvatarNotification(false);
    }, 1500);
  };

  const handleChangePassword = useCallback(async () => {
    try {
      setErrorMessage(null);

      if (!user) {
        console.error('El usuario no está logado.');
        return;
      }

      user?.role === 'TEACHER' && (await updateOwnPassword(user, oldPassword, newPassword));

      setOldPassword('');
      setNewPassword('');

      setErrorMessage(null);
      handleSavePassword();

      console.log('Password updated successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Un error desconocido ocurrió.';
      setErrorMessage(errorMessage);
      console.error('Error during password update:', error);

      setOldPassword('');
      setNewPassword('');
    }
  }, [oldPassword, newPassword, user]);

  const handleUpdateAvatar = async () => {
    if (!user) return;

    try {
      setErrorMessage('');

      let newFilename = user?.avatar || 'no-image';

      console.log(newFilename);

      if (file) {
        if (newFilename !== 'no-image') {
          try {
            const sliced = newFilename.slice(9);
            console.log(sliced);
            await instance.delete(`${baseUrl}/users/delete-avatar/${sliced}`);
          } catch (error: any) {
            if (error.response?.status !== 404) {
              throw error;
            }
          }
        }
        newFilename = await uploadAvatar(file);
        console.log('New filename received from backend:', newFilename);
      }

      const responseUpdate = await updateUserAvatar(user, newFilename);

      if (responseUpdate.status === 200) {
        setShowAvatarNotification(true);
      }
    } catch (error: any) {
      console.error('Update failed:', error.response?.data);
      setErrorMessage(
        error.response?.status === 404
          ? 'El usuario no fue encontrado.'
          : error.response?.status === 400
            ? 'La solicitud contiene datos incorrectos.'
            : 'Error en la solicitud.'
      );
    }
  };

  return (
    <ScrollArea
      bg="transparent"
      h="auto"
      style={{
        border: '1px solid var(--mantine-color-myPurple-0)',
        borderRadius: '83px 0 25px 25px',
        width: '100%',
      }}
    >
      <Center className={classes.banner} />
      <Divider size="xs" color="myPurple.1" />

      <Flex justify="center" align="center">
        <Text size="xl" py="20px" c="myPurple.0">
          Configuraciones
        </Text>
      </Flex>
      <Divider size="xs" color="myPurple.1" />

      <Flex ml="40px" justify="flex-start" align="center">
        <Text size="xl" py="20px" c="myPurple.0">
          Cambiar contraseña:
        </Text>
      </Flex>

      <Divider size="xs" color="myPurple.1" />

      <Stack m={20} mb={50}>
        <PasswordInput
          w={320}
          ml={100}
          label="Contraseña actual"
          styles={{
            label: {
              color: 'var(--mantine-color-myPurple-0)',
            },
            input: { border: '1px solid var(--mantine-color-myPurple-0)' },
          }}
          sx={{
            label: {
              color: 'purple',
            },
          }}
          value={oldPassword}
          visible={visible}
          onVisibilityChange={toggle}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Flex justify="space-between" align="flex-end">
          <PasswordInput
            w={320}
            ml={100}
            styles={{
              label: {
                color: 'var(--mantine-color-myPurple-0)',
              },
              input: { border: '1px solid var(--mantine-color-myPurple-0)' },
            }}
            label="Nueva contraseña"
            value={newPassword}
            visible={visible}
            onVisibilityChange={toggle}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            onClick={() => {
              handleChangePassword();
            }}
            variant="filled"
            size="md"
            px="50"
            mr="50"
            radius="xl"
            color="myPurple.4"
          >
            Guardar
          </Button>
        </Flex>
        {showPasswordNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <Text ml="50px" c="myPurple.12">
              ✔ ¡Tu nueva contraseña se ha guardado!
            </Text>
          </motion.div>
        )}

        {errorMessage && (
          <Text c="myPurple.11" size="md" ml="100px" fw={500}>
            {errorMessage}
          </Text>
        )}
      </Stack>

      {user?.role === 'TEACHER' || user?.role === 'MANAGER' ? (
        <>
          {' '}
          <Divider size="xs" color="myPurple.0" mt={30} />
          <Flex ml="40px" justify="flex-start" align="center">
            <Text size="xl" py="20px" c="myPurple.0">
              Notificaciones:
            </Text>
          </Flex>
          <Divider size="xs" color="myPurple.1" />
          <Flex h="200px" w="100%" justify="space-between" align="center">
            <Flex px="20px" mr="50" h="100%" w="100%" justify="space-between" align="center">
              <Checkbox
                checked={notification}
                ml={50}
                size="md"
                label="Recibir notificaciones de mis recordatorios"
                color="myPurple.4"
                c="myPurple.0"
                iconColor="white"
                onChange={(e) => {
                  updateNotification(e.currentTarget.checked);
                  handleSaveNotifications();
                }}
              />
              {/* <Button
            variant="filled"
            size="md"
            px="50"
            radius="xl"
            color="#4F51B3"
            onClick={() => {
              updateNotification(notification);
              console.log('Preferencia es:', notification);
              setNotificationStatus(true);
            }}
          >
            Guardar
          </Button> */}
            </Flex>
          </Flex>
          <Divider size="xs" color="myPurple.0" mt={30} />
          <Flex ml="40px" justify="flex-start" align="center">
            <Text size="xl" py="20px" c="myPurple.0">
              Imagen de perfil:
            </Text>
          </Flex>
          <Divider size="xs" color="myPurple.1" />
          <Flex h="200px" w="100%" justify="space-between" align="center">
            <Flex px="20px" mr="50" h="100%" w="100%" justify="space-between" align="center">
              <FileInput
                styles={{
                  label: {
                    color: 'var(--mantine-color-myPurple-0)',
                  },
                  input: { border: '1px solid var(--mantine-color-myPurple-0)' },
                }}
                ml="40px"
                rightSection={icon}
                label="Sube una imagen nueva de perfil"
                c="myPurple.0"
                placeholder="Imagen nueva de perfil"
                rightSectionPointerEvents="none"
                onChange={(file) => setFile(file)}
                size="lg"
              />
              <Button
                variant="filled"
                size="md"
                px="50"
                radius="xl"
                color="#4F51B3"
                onClick={handleUpdateAvatar}
              >
                Guardar
              </Button>
            </Flex>
          </Flex>
        </>
      ) : null}

      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -70 }}
          animate={{ opacity: 1, y: -60 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <Text ml="50px" c="myPurple.12">
            ✔ ¡Tus preferencias de notificaciones se han guardado!
          </Text>
        </motion.div>
      )}
    </ScrollArea>
  );
}
