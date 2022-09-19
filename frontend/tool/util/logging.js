let logNumber = 1;

export default function log(message) {
    const date = new Date();
    let [year, month, day, hour, min, sec] = [
        date.getFullYear(), date.getMonth() + 1,
        date.getDate(), date.getHours(),
        date.getMinutes(), date.getSeconds()
    ];
    const dateString = `${year}-${month < 10 ? "0" + month : month}-${day} ${hour}:${min}:${sec}`;
    console.log(`[[${logNumber++}]:${dateString}]: ${message}`);
}