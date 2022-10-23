export default class FileWatcher{
    constructor(file, onChange){
        this.file = file;
        this.onChange = onChange;
        this.lastModified = null;

        setInterval(this.checkFile.bind(this), 1000)
    }
    async checkFile() {
        const response = await fetch(this.file + `?_=${Date.now()}`, {method: "HEAD"});
        const lastModified = response.headers.get("last-modified");
        if (lastModified !== this.lastModified) {
            this.onChange();
            this.lastModified = lastModified;
        }
    }
}