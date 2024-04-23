export default function SendMessage(text: any, error = true) {
    return {message: String(text), error: error}
}