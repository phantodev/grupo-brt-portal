<script setup lang="ts">
import { nextTick } from 'vue';
import { usePaxStore } from '../../stores/PaxStore';
import { Pax } from '../../types/SavePaxes';
const paxStore = usePaxStore();
import useCheckCPF from '@/composables/useCheckCPF';
const { isValidCPF } = useCheckCPF();
import { useToast } from 'vue-toastification';
const toast = useToast();

const props = defineProps({
  hotelIndex: {
    type: Number,
    default: 0,
  },
  paxIndex: {
    type: Number,
    default: 0,
  },
  roomId: {
    type: String,
    default: '',
  },
  hotelId: {
    type: Number,
    default: '',
  },
});

const focusOnCPF = () => {
  nextTick(() => {
    document.getElementById(`${props.paxIndex}-${props.hotelIndex}cpf`)?.focus();
  });
};

const checkCPF = (event: any) => {
  const cpf = event.target.value;
  let errorMessage = '';

  if (cpf.length !== 14) {
    errorMessage = 'CPF precisa ter 14 caracteres!';
  } else if (!isValidCPF(cpf)) {
    errorMessage = 'CPF Inválido';
  }

  if (errorMessage) {
    toast.error(errorMessage);
    focusOnCPF();
  }
};

const checkBirthDate = (event: any) => {
  const birthDate = event.target.value;

  if (birthDate.length !== 10) {
    toast.error('Data de Nascimento ser o formato dd/mm/yyyy!');
    nextTick(() => {
      document.getElementById('nascimento')?.focus();
    });
  }
};

const roomPosition = (props.hotelIndex + 1).toString();

const getPaxField = (hotelIndex: number, paxIndex: number, field: keyof Pax) => {
  return paxStore.listPaxes[hotelIndex]?.rooms?.[0]?.paxes?.[paxIndex]?.[field] || '';
};

const initializeHotel = (hotelIndex: number) => {
  if (!paxStore.listPaxes[hotelIndex]) {
    paxStore.listPaxes[hotelIndex] = {
      hotelId: props.hotelId,
      rooms: [{ roomId: props.roomId, paxes: [] }],
    };
  }
};

const initializeRoom = (hotelIndex: number) => {
  if (!paxStore.listPaxes[hotelIndex].rooms[0]) {
    paxStore.listPaxes[hotelIndex].rooms[0] = {
      roomId: props.roomId,
      paxes: [],
    };
  }
};

const initializePax = (hotelIndex: number, paxIndex: number) => {
  if (!paxStore.listPaxes[hotelIndex].rooms[0].paxes[paxIndex]) {
    paxStore.listPaxes[hotelIndex].rooms[0].paxes[paxIndex] = {
      name: '',
      lastName: '',
      cpf: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      room: roomPosition,
    };
  }
};

[];

const setPaxField = (event: any, hotelIndex: number, paxIndex: number, field: keyof Pax) => {
  initializeHotel(hotelIndex);
  initializeRoom(hotelIndex);
  initializePax(hotelIndex, paxIndex);

  paxStore.listPaxes[hotelIndex].rooms[0].paxes[paxIndex][field] = event.target.value;
};
</script>
<template>
  <div class="flex gap-2 w-full">
    <div class="relative border-0 flex-1 w-full">
      <!-- NOME -->
      <input
        type="text"
        name=""
        :id="`${paxIndex}-${hotelIndex}name`"
        placeholder=" "
        class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
        :value="getPaxField(props.hotelIndex, props.paxIndex, 'name')"
        @input="setPaxField($event, props.hotelIndex, props.paxIndex, 'name')"
      />
      <div
        class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
      ></div>
      <div></div>
      <label
        :for="`${paxIndex}-${hotelIndex}name`"
        class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
      >
        Nome
      </label>
    </div>
    <div class="relative border-0 flex-1 w-full">
      <!-- SOBRENOME -->
      <input
        type="text"
        name=""
        :id="`${paxIndex}-${hotelIndex}lastName`"
        placeholder=" "
        class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
        :value="getPaxField(props.hotelIndex, props.paxIndex, 'lastName')"
        @input="setPaxField($event, props.hotelIndex, props.paxIndex, 'lastName')"
      />
      <div
        class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
      ></div>
      <div></div>
      <label
        :for="`${paxIndex}-${hotelIndex}lastName`"
        class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
      >
        Sobrenome
      </label>
    </div>
    <div class="relative border-0 flex-1">
      <!-- CPF -->
      <input
        v-maska
        data-maska="###.###.###-##"
        type="text"
        :id="`${paxIndex}-${hotelIndex}cpf`"
        name=""
        placeholder=" "
        class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
        :value="getPaxField(props.hotelIndex, props.paxIndex, 'cpf')"
        @input="setPaxField($event, props.hotelIndex, props.paxIndex, 'cpf')"
        @blur="checkCPF"
      />
      <div
        class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
      ></div>
      <div></div>
      <label
        :for="`${paxIndex}-${hotelIndex}cpf`"
        class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
      >
        CPF
      </label>
    </div>
    <div class="relative border-0 flex-1">
      <!-- E-MAIL -->
      <input
        type="text"
        :id="`${paxIndex}-${hotelIndex}email`"
        name=""
        placeholder=" "
        class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
        :value="getPaxField(props.hotelIndex, props.paxIndex, 'email')"
        @input="setPaxField($event, props.hotelIndex, props.paxIndex, 'email')"
      />
      <div
        class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
      ></div>
      <div></div>
      <label
        :for="`${paxIndex}-${hotelIndex}email`"
        class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
      >
        E-mail
      </label>
    </div>
    <div class="relative border-0 flex-1">
      <!-- TELEFONE -->
      <input
        v-maska
        data-maska="(##) #####-####"
        type="text"
        :id="`${paxIndex}-${hotelIndex}phone`"
        name=""
        placeholder=" "
        class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
        :value="getPaxField(props.hotelIndex, props.paxIndex, 'phone')"
        @input="setPaxField($event, props.hotelIndex, props.paxIndex, 'phone')"
      />
      <div
        class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
      ></div>
      <div></div>
      <label
        :for="`${paxIndex}-${hotelIndex}phone`"
        class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
      >
        Telefone
      </label>
    </div>

    <div class="relative border-0 flex-1">
      <!-- DATA -->
      <input
        v-maska
        data-maska="##/##/####"
        type="text"
        :id="`${paxIndex}-${hotelIndex}birthDate`"
        placeholder=" "
        class="w-full bg-blue-50 focus:ring-0 focus:border-transparent border-transparent text-blue-800 peer text-xs px-2 py-2"
        :value="getPaxField(props.hotelIndex, props.paxIndex, 'birthDate')"
        @input="setPaxField($event, props.hotelIndex, props.paxIndex, 'birthDate')"
        @blur="checkBirthDate"
      />
      <div
        class="border-blue-600 absolute top-full transition-all duration-300 bg-blue-600 w-0 h-0.5 peer-focus:w-full"
      ></div>
      <div></div>
      <label
        :for="`${paxIndex}-${hotelIndex}birthDate`"
        class="text-xs absolute -top-2 left-0 transition-all duration-300 text-blue-500 scale-[80%] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[10px] peer-placeholder-shown:left-3 peer-placeholder-shown:text-slate-500 peer-focus:-top-2 peer-focus:left-0 peer-focus:scale-[80%] peer-focus:text-blue-500"
      >
        Data Nascimento
      </label>
    </div>
    <div class="relative border-0 flex flex-1 gap-2">
      <!-- GENDER -->
      <div class="flex items-center">
        <input
          type="radio"
          :id="`${paxIndex}-${hotelIndex}male`"
          :name="`gender${paxIndex}-${hotelIndex}`"
          value="Masculino"
          class="text-blue-800 focus:ring-0"
          :checked="getPaxField(props.hotelIndex, props.paxIndex, 'gender') === 'Masculino'"
          @change="setPaxField($event, props.hotelIndex, props.paxIndex, 'gender')"
        />
        <label :for="`${paxIndex}-${hotelIndex}male`" class="text-xs ml-2">Masculino</label>
      </div>

      <div class="flex items-center">
        <input
          type="radio"
          :id="`${paxIndex}-${hotelIndex}female`"
          :name="`gender${paxIndex}-${hotelIndex}`"
          value="Feminino"
          class="text-blue-800 focus:ring-0"
          :checked="getPaxField(props.hotelIndex, props.paxIndex, 'gender') === 'Feminino'"
          @change="setPaxField($event, props.hotelIndex, props.paxIndex, 'gender')"
        />
        <label :for="`${paxIndex}-${hotelIndex}female`" class="text-xs ml-2">Feminino</label>
      </div>
    </div>
  </div>
</template>
