import { createContext, ReactNode, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { fetchSettings, updateServerSettings } from "./services/account";
import Cookies from 'js-cookie';

export interface Settings {
    darkMode: boolean;
    mondayStart: boolean;
}

interface SettingsContextType {
    settings: Settings;
    setDarkMode: (dark: boolean) => void;
    toggleDarkMode: () => void;
    setMondayStart: (monStart: boolean) => void;
    toggleMondayStart: () => void;
    loadSettings: () => void;
}
export const SettingsContext = createContext<SettingsContextType | null>(null);


const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const authHeader = useAuthHeader()();

    // default settings defined here
    const settingDefaults: Settings = {
        darkMode: false,
        mondayStart: false,
    };

    const [settings, setSettings] = useState<Settings>(settingDefaults);

    const setDarkMode = async (dark: boolean) => {
        if (settings.darkMode !== dark) {
            const newSettings = { ...settings, darkMode: dark };
            let response = (await updateServerSettings(newSettings, authHeader));

            if (!response)
                console.log("Set setting failed: No response from server");

            console.log(response)

            if (response.success) {
                setSettings(newSettings);
            } else {
                console.log("Set setting failed: " + response.message);
            }
        }
    }

    const toggleDarkMode = async () => {
        const newSettings = { ...settings, darkMode: !settings.darkMode };

        let response = (await updateServerSettings(newSettings, authHeader));

        if (!response)
            console.log("Set setting failed: No response from server");

        if (response.success) {
            setSettings(newSettings);
        } else {
            console.log("Set setting failed: " + response.message);
        }
    }

    const setMondayStart = async (monStart: boolean) => {
        if (settings.mondayStart !== monStart) {
            const newSettings = { ...settings, mondayStart: monStart };
            let response = (await updateServerSettings(newSettings, authHeader));

            if (!response)
                console.log("Set setting failed: No response from server");

            if (response.success) {
                setSettings(newSettings);
            } else {
                console.log("Set setting failed: " + response.message);
            }
        }
    }

    const toggleMondayStart = async () => {
        const newSettings = { ...settings, mondayStart: !settings.mondayStart };

        let response = (await updateServerSettings(newSettings, authHeader));

        if (!response)
            console.log("Set setting failed: No response from server");
        
        if (response.success) {
            setSettings(newSettings);
        } else {
            console.log("Set setting failed: " + response.message);
        }
    }

    const loadSettings = async () => {
        const response = await fetchSettings("Bearer " + Cookies.get('_auth')/*authHeader()*/);
        
        if (!response) {
            console.log("Load settings failed: No response from server");
            return { success: false, message: "No response from server" }
        }

        if (!response.success) {
            console.log("Load settings failed: " + response.message);
            return response;
        }


        if (response.success) {
            try {
                // rectify settings
                let newSettings = { ...settingDefaults };
                for (let setting in newSettings) {
                    if (typeof newSettings[setting] === typeof response.settings[setting])
                        newSettings[setting] = response.settings[setting];
                }
                
                setSettings(newSettings);


                return { success: true, message: "Settings set" };
            } catch (err) {
                return { success: false, message: "Error loading settings" };
            }
        } else {
            return { success: true, message: "Error retrieving settings" };
        }
    }

    return (
        <SettingsContext.Provider value={{
            settings,
            setDarkMode,
            toggleDarkMode,
            setMondayStart,
            toggleMondayStart,
            loadSettings,
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider;
