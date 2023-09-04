import { HStack, Switch, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { SettingsContext } from '../../SettingsProvider';

const StartOfWeekSetting = () => {
    const { settings, toggleMondayStart } = useContext(SettingsContext)!;

    return (
        <HStack>
            <Switch isChecked={settings.mondayStart} onChange={toggleMondayStart} />
            <Text>Start of the Week ({!settings.mondayStart ? <><b>Sunday</b>/Monday</> : <>Sunday/<b>Monday</b></> })</Text>
        </HStack>
    )
}

export default StartOfWeekSetting;