import React, { useContext, useEffect, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useMutation, gql } from "@apollo/client";
import * as SecureStore from 'expo-secure-store';
import { LoginContext } from "../context/LoginContext";

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

const LOGIN = gql`
 mutation UserLogin($username: String!, $password: String!) {
  userLogin(username: $username, password: $password) {
    accessToken
  }
}
`
export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { setIsLoggedIn } = useContext(LoginContext) 

    const [handleLogin, { loading, error, data }] = useMutation(LOGIN)

    const handleSubmit = () => {
        handleLogin({
            variables: {
                username,
                password
            },
            onCompleted: async (data) => {
                ToastAndroid.show(
                    `Login Success`,
                    ToastAndroid.SHORT
                );
                setIsLoggedIn(data.userLogin.accessToken)
                await save('accessToken', data.userLogin.accessToken)
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Image
                        source={{
                            uri:
                                'https://download.logo.wine/logo/YouTube/YouTube-Logo.wine.png',
                        }}
                        style={{ width: 250, height: 50 }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="username"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.buttonLogin}>
                    <Text style={{ color: 'white' }}>Login</Text>
                </TouchableOpacity>
                <View style={styles.buttonRegister}>
                    <Text style={{ color: 'black' }}>Don't have an account ?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={{ color: 'blue' }}>Register</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#ffffff',
    },

    header: {
        alignItems: 'center',
        marginBottom: 70
    },

    title: {
        fontSize: 23,
        fontWeight: 'bold',
    },

    inputContainer: {
        marginBottom: 20,
    },

    input: {
        width: 250,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
        marginBottom: 5,
        marginTop: 5,
        padding: 20,

    },

    image: {
        width: 10,
        height: 10
    },

    buttonLogin: {
        backgroundColor: '#ff0000',
        borderRadius: 25,
        width: 150,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonRegister: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    }
});
