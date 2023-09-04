import { createContext, ReactNode, useState } from "react";

interface Settings {
    darkMode: boolean;
    mondayStart: boolean;
}

interface SettingsContextType {
    settings: Settings;
    setDarkMode: (dark: boolean) => void;
    toggleDarkMode: () => void;
    setMondayStart: (monStart: boolean) => void;
    toggleMondayStart: () => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>({
        darkMode: false,
        mondayStart: false,
    })

    const setDarkMode = (dark: boolean) => {
        if (settings.darkMode !== dark)
            setSettings({...settings, darkMode: dark});
    }

    const toggleDarkMode = () => {
        setSettings({ ...settings, darkMode: !settings.darkMode });
    }

    const setMondayStart = (monStart: boolean) => {
        if (settings.mondayStart !== monStart)
            setSettings({ ...settings, mondayStart: monStart });
    }

    const toggleMondayStart = () => {
        setSettings({ ...settings, mondayStart: !settings.mondayStart });
    }

    return (
        <SettingsContext.Provider value={{
            settings,
            setDarkMode,
            toggleDarkMode,
            setMondayStart,
            toggleMondayStart,
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider;
