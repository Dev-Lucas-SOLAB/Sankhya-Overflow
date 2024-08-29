import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';


export default function Login() {

    const { signIn, error, load } = useAuth();

    const [visibilit, setVisibilit] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');


    function handleChangeVisibiltyInputPassword() {
        setVisibilit(!visibilit);
    }


    async function handleAuthClient() {
        await signIn(username, password);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <View>
                    <Text style={styles.title}>Acessar a aplicação</Text>
                </View>
                <TextInput style={styles.inputForm} placeholder='Login' value={username} onChangeText={value => setUsername(value)} />
                <View style={styles.inputFormPassword}>
                    <TextInput
                        placeholder='Senha'
                        secureTextEntry={visibilit ? false : true}
                        style={styles.textInput} // Adicionando estilo específico para o TextInput
                        value={password}
                        onChangeText={value => setPassword(value)}
                    />
                    <TouchableOpacity onPress={handleChangeVisibiltyInputPassword}>
                        {
                            visibilit ? <Ionicons name='lock-open-outline' size={18} color={'gray'}/> : <Ionicons name='lock-closed-outline' size={18} color={'gray'}/>
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btnLogin} onPress={handleAuthClient}>
                    {
                        load ? <ActivityIndicator size={'large'} color={'#FFFFFF'} /> : <Text style={styles.btnLoginText}>Continue</Text>

                    }
                </TouchableOpacity>

                {error && <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>}

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF"
    },

    form: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputForm: {
        backgroundColor: "#F2F2F2",
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 12,
    },

    inputFormPassword: {
        backgroundColor: "#F2F2F2",
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 12,
        flexDirection: 'row', // Alinha itens horizontalmente
        alignItems: 'center', // Alinha itens verticalmente no centro
        justifyContent: 'space-between', // Espaça os itens uniformemente
    },
    textInput: {
        flex: 1, // Ocupa o espaço disponível
        marginRight: 10, // Espaço entre o TextInput e o botão
    },

    btnLogin: {
        backgroundColor: '#6C56F2',
        width: '100%',
        marginTop: 20,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    btnLoginText: {
        color: "#FFFFFF"
    },

    title: {
        fontSize: 20,
        paddingBottom: 20
    }
});