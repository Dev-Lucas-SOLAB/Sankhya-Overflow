import React, { createContext, useState, ReactNode } from 'react';
import createApi from '../api/connect';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthData {
    callID: string | null;
    idusu: string | null;
    jsessionid: string | null;
    kID: string | null;
}


interface AuthContextData {
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => void;
    authData: AuthData;
    error: string | null;
    load: boolean;
    signed: boolean,
}


interface AuthProviderProps {
    children: ReactNode;
}


const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [error, setError] = useState<string | null>(null);
    const [load, setLoad] = useState(false);
    const [signed, setSigned] = useState(false);


    const [authData, setAuthData] = useState<AuthData>({
        callID: null,
        idusu: null,
        jsessionid: null,
        kID: null,
    });

    const signIn = async (name: string, password: string): Promise<void> => {
        try {
            setLoad(true);
            setSigned(false);
            const response = await createApi().post('/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json', {
                serviceName: "MobileLoginSP.login",
                requestBody: {
                    NOMUSU: { $: name },
                    INTERNO: { $: password },
                    KEEPCONNECTED: { $: "S" }
                }
            });

            const data = response.data;

            if (data.status === "0") {
                // Verifica se o status da resposta indica um erro
                setError(data.statusMessage || 'Erro desconhecido. Verifique suas credenciais.');
            } else {
                // Login bem-sucedido
                setAuthData({
                    callID: data.responseBody?.callID?.$ || null,
                    idusu: data.responseBody?.idusu?.$ || null,
                    jsessionid: data.responseBody?.jsessionid?.$ || null,
                    kID: data.responseBody?.kID?.$ || null,
                });

                await AsyncStorage.setItem('callID', data.responseBody?.callID?.$);
                await AsyncStorage.setItem('idusu', data.responseBody?.idusu?.$);
                await AsyncStorage.setItem('jsessionid', data.responseBody?.jsessionid?.$);
                await AsyncStorage.setItem('kID', data.responseBody?.kID?.$);

                setSigned(true);

                setError(null); // Limpa o erro caso a requisição seja bem-sucedida
            }
        } catch (err) {

            setSigned(false);

            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // O servidor respondeu com um status diferente de 2xx
                    if (err.response.status >= 500) {
                        // Erros de servidor
                        setError('Erro no servidor. Tente novamente mais tarde.');
                    } else {
                        // Outros erros de resposta
                        setError(`Erro: ${err.response.statusText}`);
                    }
                } else if (err.request) {
                    // A requisição foi feita, mas nenhuma resposta foi recebida
                    setError('Servidor indisponível. Verifique sua conexão e tente novamente.');
                } else {
                    // Algo aconteceu ao configurar a requisição
                    setError('Erro ao configurar a requisição. Tente novamente.');
                }
            } else {
                // Erros genéricos
                setError('Ocorreu um erro inesperado. Tente novamente.');
            }
        } finally {
            setLoad(false);
        }
    };


    async function logout() {
        try {

            setLoad(true);

            await AsyncStorage.clear().then(() => {
                setAuthData({
                    callID: null,
                    idusu: null,
                    jsessionid: null,
                    kID: null,
                });

                setSigned(false);
            })
           

        } catch (error) {
            console.error(error);
        } finally {
            setLoad(false);
        }
    }


    React.useEffect(() => {

        async function loadStorageData() {
            const idusu = await AsyncStorage.getItem('idusu');
            const jsessionid = await AsyncStorage.getItem('jsessionid');
            const kID = await AsyncStorage.getItem('kID');
            const callID = await AsyncStorage.getItem('callID');

            if (idusu && jsessionid) {
                setAuthData({
                    callID: callID,
                    idusu: idusu,
                    jsessionid: jsessionid,
                    kID: kID,
                });

                setSigned(true);
            }
        }

        loadStorageData();

    }, [])


    return (
        <AuthContext.Provider value={{
            signIn,
            logout,
            error,
            authData,
            load,
            signed,
        }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = (): AuthContextData => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};