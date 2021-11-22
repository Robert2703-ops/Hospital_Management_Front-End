<template>
    
    <div class="change-patient-content">
        <form class="create-patient">

            <div class="patient-info">

                <h2>Patient information</h2>

                <div class="patient-main info">
                    <div class="container-input-error-message">
                        <div class="container-message">
                            <label for=""> Patient name: </label>
                            <input type="text" id="nome" class="create-patient-modal-input">
                        </div>

                        <div class="container-error-messages">
                            <div class="error-message null">
                                <p>This field can't be <strong>NULL</strong></p>
                            </div>
                            
                            <div class="error-message too-short">
                                <p>This field need at least <strong>4 CHARACTERS</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="container-input-error-message">
                        <div class="container-message">
                            <label for=""> Patient age: </label>
                            <input type="number" id="idade" class="create-patient-modal-input">
                        </div>

                        <div class="container-error-messages">
                            <div class="error-message null">
                                <p>This field can't be <strong>NULL</strong></p>
                            </div>
                            
                            <div class="error-message too-short">
                                <p>This field can't be shorter than <strong>0</strong></p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="">Patient gender: </label>
                        <select name="" id="sexo">
                            <option value="cisgender">cisgender</option>
                            <option value="transgender">transgender</option>
                            <option value="non-binary">non-binary</option>
                        </select>
                    </div>

                </div>

                <div class="patient-other info">
                    <div class="container-input-error-message">
                        <div class="container-message">
                            <label for=""> Patient phone: </label>
                            <input type="tel" id="telefone" class="create-patient-modal-input">
                        </div>

                        <div class="container-error-messages">
                            <div class="error-message null">
                                <p>This field can't be <strong>NULL</strong></p>
                            </div>
                            
                            <div class="error-message too-short">
                                <p>This field need to be within <strong>8 AND 11 CHARACTERS</strong></p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="">Patient marital status: </label>
                        <select id="estado_civil">
                            <option value="single">single</option>
                            <option value="married">married</option>
                            <option value="divorced">divorced</option>
                            <option value="widower">widower</option>
                        </select>
                    </div>
                </div>

                <div class="patient-address info">
                    <div class="container-input-error-message">
                        <div class="container-message">
                            <label for=""> Patient address: </label>
                            <input type="text" id="endereco" class="create-patient-modal-input">
                        </div>

                        <div class="container-error-messages">
                            <div class="error-message null">
                                <p>This field can't be <strong>NULL</strong></p>
                            </div>
                            
                            <div class="error-message too-short">
                                <p>This field need at least <strong>4 CHARACTERS</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="container-input-error-message">
                        <div class="container-message">
                            <label for=""> Patient zip code: </label>
                            <input type="text" id="cep" class="create-patient-modal-input">
                        </div>

                        <div class="container-error-messages">
                            <div class="error-message null">
                                <p>This field can't be <strong>NULL</strong></p>
                            </div>
                            
                            <div class="error-message too-short">
                                <p>This field need at least <strong>4 CHARACTERS</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="container-input-error-message">
                        <div class="container-message">
                            <label for=""> Patient birth place: </label>
                            <input type="text" id="local_nascimento" class="create-patient-modal-input">
                        </div>

                        <div class="container-error-messages">
                            <div class="error-message null">
                                <p>This field can't be <strong>NULL</strong></p>
                            </div>
                            
                            <div class="error-message too-short">
                                <p>This field need at least <strong>4 CHARACTERS</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container-input-error-message">
                    <div class="container-message">
                        <label for=""> Patient history: </label>
                        <input type="text" id="historico_paciente" class="create-patient-modal-input">
                    </div>

                    <div class="container-error-messages">
                        <div class="error-message null">
                            <p>This field can't be <strong>NULL</strong></p>
                        </div>
                        
                        <div class="error-message too-short">
                            <p>This field need at least <strong>4 CHARACTERS</strong></p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="nullFieldsCreate === false" class="submit-button-container">
                <div class="submit-button">
                    <button type="button" v-on:click="SendData( HTTPmethod, null )"><i class="fas fa-plus"></i></button>
                </div>
            </div>

            <div v-else-if="nullFieldsCreate === true" class="submit-button-container">
                <div class="submit-button">
                    <button type="button" disabled><i class="fas fa-plus"></i></button>
                </div>
            </div>

        </form>
    </div>

</template>

<script>
    
    export default {
        name: 'formPatients',
        data() {
            return {
                nullFieldsCreate: false
            }
        },
        props: ['apiLink', 'HTTPmethod', 'idPatient'],
        created() {
        },
        methods: {
            SendData( HTTPmethod, data = null ) {
                const allInput = document.querySelectorAll("input.create-patient-modal-input")
                const inputValues = Object.values( allInput ).filter( input => {
                    return input ? this.CheckInputs( input )[0] === true : null
                })

                const patient = this.CreatePatient( inputValues )

                if ( inputValues.length === allInput.length && HTTPmethod  === 'POST' ) {
                    this.defaultRequisition( HTTPmethod, patient )
                }

                else if ( HTTPmethod === 'PUT' ) {
                    console.log( patient.id )
                    this.defaultRequisition( HTTPmethod, patient )
                }

                else if ( HTTPmethod === 'DELETE' && data !== null ) {
                    this.defaultRequisition( HTTPmethod, data )
                }
            },

            async defaultRequisition( HTTPmethod, data ) {
                const options = {
                    method: HTTPmethod,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }

                if ( HTTPmethod !== "DELETE" ) {
                    let requisition = await fetch ( `${this.apiLink}`, options )
                    let response = await requisition.json()

                    if ( response ) {
                        location.reload()
                    }
                }

                else {
                    let requisition = await fetch ( `${this.apiLink}`, options )

                    if ( requisition ) {
                        location.reload()
                    }
                }
            },

            // Getting the input values to create patient
            CreatePatient( inputValuesList ) {
                    const patient = {
                    nome: "",
                    idade: 0,
                    sexo: "",
                    telefone: 0,
                    estado_civil: "",
                    endereco: "",
                    cep: 0,
                    local_nascimento: "",
                    historico_paciente: "",
                    id: Number ( this.idPatient ),
                }

                patient.sexo = document.querySelector(".create-patient #sexo").value
                patient.estado_civil = document.querySelector(".create-patient #estado_civil").value

                Object.values( inputValuesList ).map( input => {
                    patient[`${input.id}`] = input.value
                })

                return patient
            },

            // HTML manipulation
            CheckInputsValues() {
                const allInput = document.querySelectorAll('input.create-patient-modal-input')

                Object.values( allInput ).map( input => {
                    input.addEventListener( 'blur', () => {
                        // div errorMessages's container and Input's container
                        let div = input.parentElement.parentElement
                        let divErrorMessages = div.querySelector('.container-error-messages')

                        // checking input's value
                        let inputChecked = this.CheckInputs( input )

                        if ( inputChecked[0] === false && inputChecked[1] === 'null' ) {
                            this.errorInput( input, div, divErrorMessages, 'null' )
                            this.EnableSubmitButton( allInput )
                        }

                        else if ( inputChecked[0] == false && inputChecked[1] === 'too-short' ) {
                            this.errorInput( input, div, divErrorMessages, 'too-short' )
                            this.EnableSubmitButton( allInput )
                        }

                        else {
                            const errorMessagesList = divErrorMessages.querySelectorAll('.error-message')

                            this.EnableSubmitButton( allInput )
                            this.RemoveErrorClass( input, errorMessagesList)
                        }
                    })
                })
            },
            CheckInputs( input ) {
                if ( input.value === "" ) {
                    return [false, "null"]
                } 

                else if ( (input.type === 'text' && input.value.length <= 4) || (input.type === 'tel' && ( input.value.length <= 8 ||  input.value.length >= 11 )) ) {
                    return [false, "too-short"]
                }

                else if ( input.type === 'number' && input.value <= 0 ) {
                    return [false, "too-short"]
                }

                else {
                    return [true, "ok!"]
                }
            },
            errorInput( input, divParent, divErrorMessage, ErrorClassMessage ) {
                input.classList.add('error')
                divParent.classList.add('error')

                let errorMessage = divErrorMessage.querySelector(`.error-message.${ErrorClassMessage}`)
                errorMessage.classList.add('show')

                setTimeout(() => {
                    divParent.classList.remove('error')
                }, 1000)

                return
            },
            EnableSubmitButton( InputList ) {
                let filledInputs = []
                filledInputs = Object.values( InputList ).filter( input => {
                    return input ? this.CheckInputs( input )[0] == false : null
                })

                if ( filledInputs.length === 0 ) {
                    this.nullFieldsCreate = false
                }
                else {
                    this.nullFieldsCreate = true
                }
            },
            RemoveErrorClass( input, errorMessages ) {
                input.classList.remove('error')

                errorMessages[0].classList.remove('show')
                errorMessages[1].classList.remove('show')
            },
        },
        mounted() {
            this.CheckInputsValues()
        }
        

    }

</script>

<style>
.form-content-create-patient, .form-content-edit-patient {
    width: 83%;
    min-height: 55%;

    background: none;

    position: relative;
}

.close-modal-create-patient, .close-modal-edit-patient {
    width: 50px;
    height: 50px;

    font-size: 20px;
    color: white;

    background: red;

    border-radius: 50%;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: -15px;
    top: -26px;
}

form.create-patient, form.edit-patient {
    width: 98%;
    height: auto;

    background: #C9CCD5;

    border-radius: 15px;
    border: 2px solid black ;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.patient-info {
    width: 100%;

    text-align: center;
}

.patient-info .info {
    width: 100%;

    margin-top: 45px;
    margin-bottom: 45px;

    display: flex;
    justify-content: space-around;
    align-items: center;
}

.patient-other.info {
    justify-content: center;
}

.patient-info .info .container-input-error-message {
    width: 35%;
}

.container-error-messages .error-message {
    display: none;
    justify-content: center;

    color: red;
    text-align: center;
}

.container-error-messages .error-message p {
    margin: 0;
}

.container-error-messages .error-message.null.show {
    display: flex;
}

.container-error-messages .error-message.too-short.show {
    display: flex;
}

.patient-info .info label, .container-message label {
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 800;
}

.patient-info .info input, .container-input-error-message input {
    width: 30%;
    height: 22px;

    border-radius: 5px;

    transition: 0.10s;
}

.patient-info .info input:focus, .container-input-error-message input:focus {
    width: 54%;
}

.create-patient-modal-input.error {
    border: 1px solid #FF5151;
}

.container-input-error-message.error {
    animation: errorInput .3s;
}

.patient-info .patient-main.info #idade:focus {
    width: 35%;
}

.patient-info .patient-other.info #telefone:focus {
    width: 35%;
}

.submit-button {
    width: 15%;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
}


.submit-button-container {
    width: 100%;
    height: 43px;

    display: flex;
    justify-content: center;

    margin-top: 30px;
    margin-bottom: 10px;
}

.submit-button {
    width: 10%;
    height: 100%;

    border-radius: 5px;

    transition: 0.15s;
}

.submit-button:hover {
    width: 12%;
}

.submit-button button {
    width: 100%;
    height: 100%;

    border-radius: 5px;

    cursor: pointer;
}

.submit-button button:hover {
    background: black;
    
    color: white;
}


/* keyframes */
@keyframes errorInput {
    0% {
        transform: translateX(30px);
    }
    25% {
        transform: translateX(-30px);
    }

    50%{
        transform: translateX(30px);
    }
    75% {
        transform: translateX(-30px);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}

</style>