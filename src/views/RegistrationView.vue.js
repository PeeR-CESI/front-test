/* __placeholder__ */
import { defineComponent, ref } from 'vue';
export default defineComponent({
    name: 'InscriptionPage',
    setup() {
        const nom = ref('');
        const prenom = ref('');
        const email = ref('');
        const adresse = ref('');
        const role = ref('demandeur');
        const username = ref('');
        const password = ref('');
        const createUser = async () => {
            try {
                const response = await fetch('http://peer.cesi:5000/user/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nom: nom.value,
                        prenom: prenom.value,
                        email: email.value,
                        adresse: adresse.value,
                        role: role.value,
                        username: username.value,
                        password: password.value,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}`);
                }
                const data = await response.json();
                console.log('Utilisateur créé:', data);
                // Gérer la redirection ou autres actions post-création ici
                // Par exemple : router.push('/login');
            }
            catch (error) {
                console.error('Erreur:', error);
            }
        };
        return {
            nom,
            prenom,
            email,
            adresse,
            role,
            username,
            password,
            createUser,
        };
    },
});
const __VLS_componentsOption = {};
const __VLS_name = 'InscriptionPage';
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
    __VLS_intrinsicElements.h2;
    __VLS_intrinsicElements.h2;
    __VLS_intrinsicElements.form;
    __VLS_intrinsicElements.form;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.input;
    __VLS_intrinsicElements.select;
    __VLS_intrinsicElements.select;
    __VLS_intrinsicElements.option;
    __VLS_intrinsicElements.option;
    __VLS_intrinsicElements.option;
    __VLS_intrinsicElements.option;
    __VLS_intrinsicElements.button;
    __VLS_intrinsicElements.button;
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
            __VLS_15 = { submit: (__VLS_ctx.createUser) };
            {
                const __VLS_16 = __VLS_intrinsicElements["input"];
                const __VLS_17 = __VLS_elementAsFunctionalComponent(__VLS_16);
                const __VLS_18 = __VLS_17({ ...{}, value: ((__VLS_ctx.nom)), type: ("text"), placeholder: ("Nom"), }, ...__VLS_functionalComponentArgsRest(__VLS_17));
                ({}({ ...{}, value: ((__VLS_ctx.nom)), type: ("text"), placeholder: ("Nom"), }));
                const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18);
            }
            {
                const __VLS_21 = __VLS_intrinsicElements["input"];
                const __VLS_22 = __VLS_elementAsFunctionalComponent(__VLS_21);
                const __VLS_23 = __VLS_22({ ...{}, value: ((__VLS_ctx.prenom)), type: ("text"), placeholder: ("Prénom"), }, ...__VLS_functionalComponentArgsRest(__VLS_22));
                ({}({ ...{}, value: ((__VLS_ctx.prenom)), type: ("text"), placeholder: ("Prénom"), }));
                const __VLS_24 = __VLS_pickFunctionalComponentCtx(__VLS_21, __VLS_23);
            }
            {
                const __VLS_26 = __VLS_intrinsicElements["input"];
                const __VLS_27 = __VLS_elementAsFunctionalComponent(__VLS_26);
                const __VLS_28 = __VLS_27({ ...{}, type: ("email"), placeholder: ("Email"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
                ({}({ ...{}, type: ("email"), placeholder: ("Email"), }));
                (__VLS_ctx.email);
                const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
            }
            {
                const __VLS_31 = __VLS_intrinsicElements["input"];
                const __VLS_32 = __VLS_elementAsFunctionalComponent(__VLS_31);
                const __VLS_33 = __VLS_32({ ...{}, value: ((__VLS_ctx.adresse)), type: ("text"), placeholder: ("Adresse"), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
                ({}({ ...{}, value: ((__VLS_ctx.adresse)), type: ("text"), placeholder: ("Adresse"), }));
                const __VLS_34 = __VLS_pickFunctionalComponentCtx(__VLS_31, __VLS_33);
            }
            {
                const __VLS_36 = __VLS_intrinsicElements["select"];
                const __VLS_37 = __VLS_elementAsFunctionalComponent(__VLS_36);
                const __VLS_38 = __VLS_37({ ...{}, value: ((__VLS_ctx.role)), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                ({}({ ...{}, value: ((__VLS_ctx.role)), }));
                {
                    const __VLS_41 = __VLS_intrinsicElements["option"];
                    const __VLS_42 = __VLS_elementAsFunctionalComponent(__VLS_41);
                    const __VLS_43 = __VLS_42({ ...{}, value: ("demandeur"), }, ...__VLS_functionalComponentArgsRest(__VLS_42));
                    ({}({ ...{}, value: ("demandeur"), }));
                    (__VLS_44.slots).default;
                    const __VLS_44 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43);
                }
                {
                    const __VLS_46 = __VLS_intrinsicElements["option"];
                    const __VLS_47 = __VLS_elementAsFunctionalComponent(__VLS_46);
                    const __VLS_48 = __VLS_47({ ...{}, value: ("presta"), }, ...__VLS_functionalComponentArgsRest(__VLS_47));
                    ({}({ ...{}, value: ("presta"), }));
                    (__VLS_49.slots).default;
                    const __VLS_49 = __VLS_pickFunctionalComponentCtx(__VLS_46, __VLS_48);
                }
                (__VLS_39.slots).default;
                const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
            }
            {
                const __VLS_51 = __VLS_intrinsicElements["input"];
                const __VLS_52 = __VLS_elementAsFunctionalComponent(__VLS_51);
                const __VLS_53 = __VLS_52({ ...{}, value: ((__VLS_ctx.username)), type: ("text"), placeholder: ("Username"), }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                ({}({ ...{}, value: ((__VLS_ctx.username)), type: ("text"), placeholder: ("Username"), }));
                const __VLS_54 = __VLS_pickFunctionalComponentCtx(__VLS_51, __VLS_53);
            }
            {
                const __VLS_56 = __VLS_intrinsicElements["input"];
                const __VLS_57 = __VLS_elementAsFunctionalComponent(__VLS_56);
                const __VLS_58 = __VLS_57({ ...{}, type: ("password"), placeholder: ("Password"), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                ({}({ ...{}, type: ("password"), placeholder: ("Password"), }));
                (__VLS_ctx.password);
                const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
            }
            {
                const __VLS_61 = __VLS_intrinsicElements["button"];
                const __VLS_62 = __VLS_elementAsFunctionalComponent(__VLS_61);
                const __VLS_63 = __VLS_62({ ...{}, type: ("submit"), }, ...__VLS_functionalComponentArgsRest(__VLS_62));
                ({}({ ...{}, type: ("submit"), }));
                (__VLS_64.slots).default;
                const __VLS_64 = __VLS_pickFunctionalComponentCtx(__VLS_61, __VLS_63);
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
    [createUser, nom, prenom, email, adresse, role, username, password,];
    return __VLS_slots;
}
let __VLS_internalComponent;
