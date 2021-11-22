<template>
    <div class="main-content-change-patient">

        <header>
            <h1>Hospital Santa Cruz</h1>
        </header>

        <div class="back-to-patient-list-message">
            <div class="go-back-home">
                <button type="button" v-on:click="redirectPageHome()"><i class="fas fa-arrow-left"></i></button>
            </div>
            <div class="home-message">
                HOME
            </div>
        </div>

        <div class="form-content-change-patient">
            <formPatients v-bind:apiLink="apiLink" v-bind:HTTPmethod="'PUT'" v-bind:idPatient="idPatient"></formPatients>
        </div>

    </div>
</template>

<script>
    import formPatients from './Form-patients'

    export default {
        name: 'changePatient',
        data() {
            return {
                apiLink: "https://apirest-pacientes.herokuapp.com/api/pacientes",
                idPatient: Number ( this.$route.params.id ),
                patient: {}
            }
        },
        components: {
            formPatients
        },
        methods: {
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
                    this.FillingFields( response, this.idPatient )
                }
            },

            redirectPageHome() {
                this.$router.push({ name: 'Home' })
            },

            // filling the inputs fields
            FillingFields( patientsList, idPatient ) {
                this.patient = Object.values( patientsList ).filter( patient => {
                    return patient.id === idPatient
                })
                
                const allInput = document.querySelectorAll('input.create-patient-modal-input')

                for( let index in this.patient[0] ) {
                    if ( document.querySelector( `#${index}` ) ){
                        document.querySelector( `#${index}` ).value = this.patient[0][`${index}`]
                    }
                }
            },

            // HTML manipulation method
            ShowMessage() {
                const divContainerArrow = document.querySelector('div.go-back-home button i')
                const divContainerMessage = document.querySelector('div.home-message')

                divContainerArrow.addEventListener('mouseenter', () => {
                    divContainerMessage.classList.add('show')

                    divContainerArrow.addEventListener('mouseout', () => {
                        divContainerMessage.classList.remove('show')
                    })
                })
            }
        },
        created() {
            this.GetPatients()
        },
        mounted() {
            this.ShowMessage()
        }
    }
</script>

<style>
.main-content-change-patient {
    width: 100%;
    height: 100%;

    position: relative;
}

.main-content-change-patient header {
    width: 100%;
    
    display: flex;
    justify-content: center;
}

.form-content-change-patient, .change-patient-content {
    width: 100%;
    height: 100%;
}

.back-to-patient-list-message {
    width: 10%;
    height: 20%;

    position: absolute;
    top: 10px;
    left: 0;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
}

.go-back-home {
    width: 100%;
    height: 45%;

    display: flex;
    justify-content: center;
    align-items: center;
}
.go-back-home button {
    width: 70%;
    height: 100%;

    background: none;
    border: none; 

    font-size: 22px;

    cursor: pointer;
}

.go-back-home button i {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}


.home-message {
    display: none;
    justify-content: center;
    align-items: center;

    width: 60%;
    height: 25%;

    border-radius: 10px;

    background: black;
    color: white;
}
.home-message.show {
    display: flex;
    animation: ShowHomeMessage 0.30s;
}

.change-patient-content {
    display: flex;
    justify-content: center;
    align-items: center;
}


@keyframes ShowHomeMessage {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>

