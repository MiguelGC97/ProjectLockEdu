import { Box, Center, Divider } from "@mantine/core";
import classes from './SettingsBox.module.css';

export function SettingsBox(){
    return(
        <>
        <Box bg="transparent" h="80vh" bd="1px solid myPurple.1" w="100%"  style={{
            borderRadius: '83px 0 25px 25px'
        }} >
            <Center className={classes.banner}></Center>
            <Divider size="xs" color="myPurple.1" />
        </Box>
      
        </>
    )
}