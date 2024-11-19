import { Card, Overlay } from '@mantine/core';
import classes from './Banner.module.css';

export function Banner() {
  return (
    <Card radius="none" className={classes.card}>
      <Overlay
        gradient="linear-gradient(90deg, var(--mantine-color-myPurple-4) 5%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 64%, rgba(231,175,46,1) 100%)"
        opacity={0.65}
        zIndex={0}
      />

      <div className={classes.content}>
        <h1 className={classes.title}>¡Hola Pepito!</h1>
      </div>
    </Card>
  );
}
