export interface ModalConfig {
    title: string;
    confirmTitle: string;
    cancelTitle?: string;
    type: 'Error' | 'Info' | 'Success'
}
