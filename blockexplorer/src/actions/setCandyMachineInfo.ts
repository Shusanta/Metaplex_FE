import { action } from 'satcheljs';
// pass candy machine data to be decrypted
export const setCandyMachineInfo = action('setCandyMachineInfo', (data: Buffer) => ({
    data
}));

