import { atob } from 'k6/encoding';
import { sleep } from 'k6';

const token = "seu_token_aqui";

// Função para decodificar o token
function decodeToken(token) {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error("Token inválido. Não possui as três partes esperadas.");
        }

        const header = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(atob(parts[0]).split('').map(c => c.charCodeAt(0)))));
        const payload = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(atob(parts[1]).split('').map(c => c.charCodeAt(0)))));

        return {
            header,
            payload,
        };
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
}

export default function () {
    const decodedToken = decodeToken(token);

    // Decodificar o token e atribuir a variável decodedToken
    if (decodedToken) {
        console.info(decodedToken);
        // Se quiser acessar um campo específico, por exemplo, o payload:
        // console.info(decodedToken.payload);
    } else {
        console.error("A decodificação do token falhou.");
    }

    sleep(1);
}
