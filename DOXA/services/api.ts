import axios from 'axios';

// Para Android Emulator use 10.0.2.2. Se usar dispositivo físico, coloque o IP local da máquina rodando o Spring Boot (ex: 192.168.x.x)
const API_URL = 'http://10.0.2.2:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
