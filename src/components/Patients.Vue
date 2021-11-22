<template>
    <div class="main-content-patients">

        <div class="content-patients">
            <header>
                <h1>Hospital Santa Cruz</h1>
            </header>
    
            <div class="table-patient-message-container">
                <div class="message">
                    <h2>Patients: {{ search }}</h2>
                </div>

                <div class="patients-search-create-patient">
                    <div class="patients-search">
                        <div class="search-error-message">
                            <div class="search-patient">
                                <input type="text" v-model="search">
                                <div class="search-icon"><button><i class="fas fa-search"></i></button></div>
                            </div>
                            <div class="error-message-search">
                                <p>Patient not found!</p>
                            </div>
                        </div>
                    </div>

                    <div class="patients-table-create-patient">
                        <table class="">
                            <thead>
                                <tr>
                                    <th><h3> Patient Name </h3></th>
                                    <th><h3> Patient Age</h3></th>
                                    <th><h3> Patient Gender</h3></th>
                                    <th><h3> Patient history</h3></th>
                                </tr>
                            </thead>
                            <tbody class="patient-list">
                                <tr v-if="patients" v-for="patient in patients" v-bind:key="patient.id">
                                    <th> {{patient.nome}} </th>
                                    <th> {{patient.idade}} </th>
                                    <th> {{patient.sexo}} </th>
                                    <th> {{patient.historico_paciente}} </th>
                                    <th> 
                                        <div class="patient-container-options">
                                            <div class="edit-patient options-patient">
                                                <button type="button" v-on:click="Redirectpage(  'change-patient-info', patient.id )"><i class="fas fa-pencil-alt"></i></button>
                                            </div>
                                            <div class="delete-patient options-patient">
                                                <button type="button" v-on:click="deletePatient( 'DELETE', patient )"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div> 
                                    </th>
                                </tr>
                            </tbody>
                        </table>

                        <div class="create-patient-button">
                            <button v-on:click="ShowModal('create-patient-modal'), CheckFields( 'create', 'create-patient' )"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="create-patient-modal" id="create-patient-modal">

            <div class="form-content-create-patient">
                <div class="close-modal-create-patient">X</div>
                
                <formPatients v-bind:apiLink="apiLink" v-bind:HTTPmethod="'POST'" v-bind:idPatient="'0'"></formPatients>
            </div>
        
        </div>

    </div>
</template>

<script>
    import formPatients from './Form-patients'

    export default 
    {
        name: 'MainContent',
        components: {
            formPatients
        },
        data() {
            return {
                allPatients: [],
                patients: [],
                search: "all-patients",
                apiLink: "https://apirest-pacientes.herokuapp.com/api/pacientes",

            }
        },
        created() {
            this.GetPatients()

        },
        methods: 
        {
            // requisitions
            async GetPatients() {
                const options = {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                }

                const requisition = await fetch(this.apiLink, options)
                const response = await requisition.json()

                if ( response ) {
                    this.allPatients = response
                    this.patients = this.allPatients
                }
            },

            deletePatient( HTTPmethod, data = null ) {
                if ( HTTPmethod === 'DELETE' && data !== null ) {
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

            // HTML modification
            CheckFields( inputClass, action ) {
                const allInput = document.querySelectorAll(`input.${inputClass}-patient-modal-input`)
                
                for ( let index = 0; index < allInput.length; index += 1 ) {
                    allInput[index].addEventListener('blur', () => {
                        const div = allInput[index].parentElement.parentElement
                        const errorMessage = div.querySelector('.container-error-messages')

                        const inputChecked = this.CheckInputValue( allInput[index] )

                        if ( inputChecked[0] === false && inputChecked[1] === "null" ) {
                            this.errorInput( allInput[index], div, errorMessage, "null" )
                            this.EnableSubmitButton( allInput, action )
                        }

                        else if ( inputChecked[0] === false && inputChecked[1] === "too-short" ){
                            this.errorInput( allInput[index], div, errorMessage, "too-short" )
                            this.EnableSubmitButton( allInput, action )
                        }

                        else {
                            const errorMessagesList = errorMessage.querySelectorAll('.error-message')
                            this.RemoveErrorClass( allInput[index], errorMessagesList )
                            this.EnableSubmitButton( allInput, action )
                        }

                    })
                }
            },   
            CheckInputValue( input ) {
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
            RemoveErrorClass( input, errorMessages ) {
                input.classList.remove('error')

                errorMessages[0].classList.remove('show')
                errorMessages[1].classList.remove('show')
            },
            EnableSubmitButton( InputList, action ) {
                let emptyInput = []

                emptyInput = Object.values( InputList ).filter( input => {
                    return input ? this.CheckInputValue( input )[0] === false : null
                })
                
                if ( action === "create-patient" ){
                    if ( emptyInput.length === 0 ) {
                        this.nullFieldsCreate = false
                    }

                    else {
                        this.nullFieldsCreate = true
                    }
                }

                else if ( action === "edit-patient" ) {
                    if ( emptyInput.length === 0 ) {
                        this.nullFieldsEdit = false
                    }

                    else {
                        this.nullFieldsEdit = true
                    }
                }
                    
            },
            ShowModal( idElement ) {
                const modal = document.getElementById(idElement)
            
                modal.classList.add('show')

                modal.addEventListener('click', (event) => {                    
                    if ( event.target.id === idElement || event.target.className === "close-modal-create-patient" || event.target.className === "close-modal-edit-patient" ) {
                        modal.classList.remove('show')
                    }
                })
            },

            // redirect to edit patient
            Redirectpage(  path, params ) {
                this.$router.push({ name: path, params: { id: params } })
            },

            // update table
            ChangeTable ( patientsList ) {
                const tbody = document.querySelector('.patient-list')

                if ( tbody.classList[1] === 'in' ) {
                    tbody.classList.replace('in', 'out')

                    this.patients = patientsList

                    setTimeout(() => {
                        tbody.classList.replace('out', 'in')
                    }, 500)

                    tbody.classList.remove('in')

                    return
                }

                else {
                    tbody.classList.add('out')

                    this.patients = patientsList

                    setTimeout(() => {
                        tbody.classList.replace('out', 'in')
                    }, 500)

                    tbody.classList.remove('in')

                    return
                }
            }
        },
        watch: {
            search: function () {
                const input = document.querySelector('.search-patient input')
                const searchButton = document.querySelector('.search-icon')
                const divError = document.querySelector('.search-error-message .error-message-search')

                const tbody = document.querySelector('.patient-list')

                if ( this.search.length !== 0 ) {
                    const newPatients = Object.values( this.allPatients ).filter( patient => {
                        let patientName = patient.nome.split(" ") 
                        return patient ? patientName[0] === this.search : null
                    })

                    if ( newPatients.length <= 0 ) {
                        input.classList.add("error")
                        searchButton.classList.add("error")
                        divError.classList.add("show")

                        this.ChangeTable( this.allPatients )
                    }
                    else {
                        input.classList.remove("error")
                        searchButton.classList.remove("error")
                        divError.classList.remove("show") 

                        this.ChangeTable( newPatients )
                    }
                }

                else {
                    input.classList.remove("error")
                    searchButton.classList.remove("error")
                    divError.classList.remove("show")

                    this.ChangeTable( this.allPatients )
                }
            }
        }
    }
    
</script>

<style>
.main-content-patients {
    width: 100%;
    height: 100%;
}

.content-patients {
    width: 100%;
    height: 100%;
}

.content-patients header {
    width: 100%;
    height: 15%;

    text-align: center;

    margin-bottom: 45px;
}

.table-patient-message-container {
    width: 95%;
    height: 95%;

    border-radius: 15px;

    margin-left: auto;
    margin-right: auto;

    background: #C9CCD5;
}

.table-patient-message-container .message {
    text-align: center;
    height: 15%;

    display: flex;
    justify-content: center;
    align-items: end;
}

.patient-container-options {
    width: 100%;
    height: 30px;

    display: flex;
    justify-content: space-around;
}

.options-patient {
    width: 45%;
    height: 100%;
}

.options-patient button {
    width: 75%;
    height: 100%;

    cursor: pointer;
}

.options-patient.edit-patient button {
    background: none;

    border: 2px solid #77D970; /* B4FE98 17D7A0 */
    
    color: black; 

    transition: 0.10s;
}
.options-patient.edit-patient button:hover {
    background: #77D970;

    color: white;
}

.delete-patient.options-patient button {
    background: none;

    border: 1px solid #FF5151;

    color: black;

    transition: 0.10s;
}
.delete-patient.options-patient button:hover {
    background: #FF5151;

    color: white;
}


.patients-search-create-patient {
    width: 100%;
    min-height: 35%;
    
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.patients-search-create-patient .patients-search {
    width: 85%;
    height: 60px;

    margin-bottom: 35px;

    display: flex;
    align-items: center;
}
.search-error-message {
    width: 100%;
    height: 95%;
    
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.search-patient {
    width: 100%;
    height: 50%;

    display: flex;
    justify-content: center;
    align-items: center; 
}
.search-error-message .search-patient input {
    width: 85%;
    height: 90%; 

    font-size: 16px;

    margin-right: 5px;

    transition: 0.10s;
}
.search-error-message input.error {
    border: 1px solid #FF5151;
    outline: red;
}

.search-error-message .search-icon {
    width: 4%;
    height: 100%;
}
.search-error-message .search-icon button {
    width: 100%;
    height: 100%;

    cursor: pointer;
}
.search-error-message .search-icon.error button {
    background: red;

    color: white;

    border: 1px solid red;
}


.search-error-message .error-message-search {
    width: 100%;
    height: 35%;

    display: none;
    justify-content: center;
    align-items: center;

    text-align: center;
    color: red;

    margin-top: 10px;

    transition: 0.20s;
}

.search-error-message .error-message-search p {
    width: 100%;
    height: 100%;

    font-size: 18px;

    margin: 0;
}

.search-error-message .error-message-search.show {
    display: flex;

    animation: showErrorSearch .20s;
}


.patients-search-create-patient .patients-table-create-patient {
    width: 80%;
    
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    align-items: center;
}
tbody.patient-list tr th {
    font-size: 16px;
}

/* table, create-patient-button */
.patients-search-create-patient .patients-table-create-patient table {
    width: 100%;

    margin-bottom: 20px;
}

.create-patient-button {
    width: 30%;
    height: 35px;

    display: flex;
    justify-content: center;
}

.create-patient-button button {
    width: 75%;

    border: 1px solid black;

    transition: 0.15s;

    cursor: pointer;
}

.create-patient-button button:hover {
    width: 83%;
    
    color: white;

    background: black;
}

/* modal */
.create-patient-modal, .edit-patient-modal {
    width: 100vw;
    height: 100vh;

    background: rgba(0, 0, 0, .5);

    position: fixed;
    top: 0px;
    left: 0px; 

    display: none;
    justify-content: center;
    align-items: center;    
}
.create-patient-modal.show, .edit-patient-modal.show {
    display: flex;
}

/* table animation */
.patient-list.out {
    animation: PatientsOut .20s forwards;
}

.patient-list.in {
    animation: PatientsIn .20s;
}

/* keyframes */
@keyframes showErrorSearch {
    from {
        opacity: 0;
        transform: translateX(-35px)
    }
    to {
        opacity: 1;
        transform: translateX(0)
    }
}

@keyframes PatientsOut {
    from {
        opacity: 1;
        transform: translateX(0)
    }
    to {
        opacity: 0;
        transform: translateX(-40px)
    }
}

@keyframes PatientsIn {
    from {
        opacity: 0;
        transform: translateX(40px)
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

</style>