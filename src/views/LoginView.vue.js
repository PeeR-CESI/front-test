/* __placeholder__ */
import { defineComponent, ref } from 'vue';
import { useRouter } from "vue-router";
export default defineComponent({
    name: 'LoginPage',
    setup() {
        const router = useRouter();
        const credentials = ref({
            username: '',
            password: '',
        });
        const error = ref(false);
        const errorMessage = ref('');
        const goToInscription = () => {
            router.push('/inscription');
        };
        const login = async () => {
            error.value = false;
            errorMessage.value = '';
            try {
                const response = await fetch('http://peer.cesi:5000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials.value),
                });
                if (!response.ok) {
                    throw response;
                }
                const data = await response.json();
                console.log(data); // Gérez la réussite de la connexion ici
                // Par exemple, sauvegardez le token et redirigez l'utilisateur
            }
            catch (err) {
                error.value = true;
                if (err instanceof Response) {
                    if (err.status === 404) {
                        errorMessage.value = 'Nom d’utilisateur non trouvé.';
                    }
                    else if (err.status === 401) {
                        errorMessage.value = 'Mot de passe incorrect.';
                    }
                    else {
                        errorMessage.value = 'Erreur lors de la connexion.';
                    }
                }
                else {
                    errorMessage.value = 'Une erreur inconnue est survenue.';
                }
            }
        };
        return {
            credentials,
            error,
            errorMessage,
            login,
            goToInscription,
        };
    },
});
const __VLS_componentsOption = {};
const __VLS_name = 'LoginPage';
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    /* CSS variable injection */
    /* CSS variable injection end */
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.h2;
    __VLS_intrinsicElements.h2;
    __VLS_intrinsicElements.form;
    __VLS_intrinsicElements.form;
    __VLS_intrinsicElements.label;
    __VLS_intrinsicElements.label;
    __VLS_intrinsicElements.label;
    __VLS_intrinsicElements.label;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.button;
    __VLS_intrinsicElements.button;
    __VLS_intrinsicElements.button;
    __VLS_intrinsicElements.button;
    __VLS_intrinsicElements.p;
    __VLS_intrinsicElements.p;
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, }));
        {
            const __VLS_5 = __VLS_intrinsicElements["h2"];
            const __VLS_6 = __VLS_elementAsFunctionalComponent(__VLS_5);
            const __VLS_7 = __VLS_6({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, }));
            (__VLS_8.slots).default;
            const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
        }
        {
            const __VLS_10 = __VLS_intrinsicElements["form"];
            const __VLS_11 = __VLS_elementAsFunctionalComponent(__VLS_10);
            const __VLS_12 = __VLS_11({ ...{ 'onSubmit': {}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_11));
            ({}({ ...{ 'onSubmit': {}, }, }));
            let __VLS_15 = { 'submit': __VLS_pickEvent(__VLS_14['submit'], {}.onSubmit) };
            __VLS_15 = { submit: (__VLS_ctx.login) };
            {
                const __VLS_16 = __VLS_intrinsicElements["div"];
                const __VLS_17 = __VLS_elementAsFunctionalComponent(__VLS_16);
                const __VLS_18 = __VLS_17({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
                ({}({ ...{}, }));
                {
                    const __VLS_21 = __VLS_intrinsicElements["label"];
                    const __VLS_22 = __VLS_elementAsFunctionalComponent(__VLS_21);
                    const __VLS_23 = __VLS_22({ ...{}, for: ("username"), }, ...__VLS_functionalComponentArgsRest(__VLS_22));
                    ({}({ ...{}, for: ("username"), }));
                    (__VLS_24.slots).default;
                    const __VLS_24 = __VLS_pickFunctionalComponentCtx(__VLS_21, __VLS_23);
                }
                {
                    const __VLS_26 = __VLS_intrinsicElements["input"];
                    const __VLS_27 = __VLS_elementAsFunctionalComponent(__VLS_26);
                    const __VLS_28 = __VLS_27({ ...{}, id: ("username"), value: ((__VLS_ctx.credentials.username)), type: ("text"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
                    ({}({ ...{}, id: ("username"), value: ((__VLS_ctx.credentials.username)), type: ("text"), required: (true), }));
                    const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
                }
                (__VLS_19.slots).default;
                const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18);
            }
            {
                const __VLS_31 = __VLS_intrinsicElements["div"];
                const __VLS_32 = __VLS_elementAsFunctionalComponent(__VLS_31);
                const __VLS_33 = __VLS_32({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_32));
                ({}({ ...{}, }));
                {
                    const __VLS_36 = __VLS_intrinsicElements["label"];
                    const __VLS_37 = __VLS_elementAsFunctionalComponent(__VLS_36);
                    const __VLS_38 = __VLS_37({ ...{}, for: ("password"), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                    ({}({ ...{}, for: ("password"), }));
                    (__VLS_39.slots).default;
                    const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
                }
                {
                    const __VLS_41 = __VLS_intrinsicElements["input"];
                    const __VLS_42 = __VLS_elementAsFunctionalComponent(__VLS_41);
                    const __VLS_43 = __VLS_42({ ...{}, id: ("password"), type: ("password"), required: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_42));
                    ({}({ ...{}, id: ("password"), type: ("password"), required: (true), }));
                    (__VLS_ctx.credentials.password);
                    const __VLS_44 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43);
                }
                (__VLS_34.slots).default;
                const __VLS_34 = __VLS_pickFunctionalComponentCtx(__VLS_31, __VLS_33);
            }
            {
                const __VLS_46 = __VLS_intrinsicElements["button"];
                const __VLS_47 = __VLS_elementAsFunctionalComponent(__VLS_46);
                const __VLS_48 = __VLS_47({ ...{}, type: ("submit"), }, ...__VLS_functionalComponentArgsRest(__VLS_47));
                ({}({ ...{}, type: ("submit"), }));
                (__VLS_49.slots).default;
                const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_46, __VLS_48);
            }
            if (__VLS_ctx.error) {
                {
                    const __VLS_51 = __VLS_intrinsicElements["div"];
                    const __VLS_52 = __VLS_elementAsFunctionalComponent(__VLS_51);
                    const __VLS_53 = __VLS_52({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                    ({}({ ...{}, }));
                    {
                        const __VLS_56 = __VLS_intrinsicElements["p"];
                        const __VLS_57 = __VLS_elementAsFunctionalComponent(__VLS_56);
                        const __VLS_58 = __VLS_57({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                        ({}({ ...{}, }));
                        (__VLS_ctx.errorMessage);
                        (__VLS_59.slots).default;
                        const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
                    }
                    (__VLS_54.slots).default;
                    const __VLS_54 = __VLS_pickFunctionalComponentCtx(__VLS_51, __VLS_53);
                }
                // @ts-ignore
                [login, credentials, credentials, error, errorMessage,];
            }
            {
                const __VLS_61 = __VLS_intrinsicElements["button"];
                const __VLS_62 = __VLS_elementAsFunctionalComponent(__VLS_61);
                const __VLS_63 = __VLS_62({ ...{ 'onClick': {}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_62));
                ({}({ ...{ 'onClick': {}, }, }));
                let __VLS_66 = { 'click': __VLS_pickEvent(__VLS_65['click'], {}.onClick) };
                __VLS_66 = { click: (__VLS_ctx.goToInscription) };
                (__VLS_64.slots).default;
                const __VLS_64 = __VLS_pickFunctionalComponentCtx(__VLS_61, __VLS_63);
                let __VLS_65;
            }
            (__VLS_13.slots).default;
            const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12);
            let __VLS_14;
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
    }
    var __VLS_slots;
    // @ts-ignore
    [goToInscription,];
    return __VLS_slots;
}
let __VLS_internalComponent;
