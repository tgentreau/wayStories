import { UserSignin, UserLogin } from '@/types/user';
import { getAuth } from '@react-native-firebase/auth';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        signin: builder.mutation({
            async queryFn(user: UserSignin) {
                try {
                    const auth = getAuth();
                    const response = await auth.createUserWithEmailAndPassword(user.email, user.password);
                    return { data: response };
                } catch (error) {
                    return { error };
                }
            }
        }),
        login: builder.mutation({
            async queryFn(user: UserLogin) {
                try {
                    const auth = getAuth();
                    const response = await auth.signInWithEmailAndPassword(user.email, user.password);
                    return { data: response };
                } catch (error) {
                    return { error };
                }
            }
        })
    }),
})