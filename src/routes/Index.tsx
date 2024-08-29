import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Authenticated from './Authenticated.routes';
import Unauthenticated from './Unauthenticated.routes';


export default function Index() {

    const { signed } = useAuth();



    return (
        <NavigationContainer>
            {
                signed ? <Authenticated /> : <Unauthenticated />
            }
        </NavigationContainer>
    )
}