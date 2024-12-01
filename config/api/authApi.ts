import { UserSignin, UserLogin } from '@/types/user';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        signin: builder.mutation({
            async queryFn(user: UserSignin) {
                try {
                    const auth: Auth = getAuth();
                    const response = await createUserWithEmailAndPassword(auth, user.email, user.password);
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
                    const response = await signInWithEmailAndPassword(auth, user.email, user.password);
                    return { data: response };
                } catch (error) {
                    return { error };
                }
            }
        })
    }),
})
