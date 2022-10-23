# looking-glass-fusion

An Addin for Autodesk Fusion 360 that lets you view your CAD design on a Looking Glass Portrait 3D display.

## Usage

1. Download this [repo's ZIP file](https://github.com/brianpeiris/looking-glass-fusion/archive/refs/heads/main.zip)
2. Extract it to a location of your choosing
3. Add the addin in Fusion's "Tools -> Addins" dialog
4. Run the addin
5. Visit http://localhost:3000 in your browser
6. Move the browser window to your Looking Glass display

You can use your mouse to rotate and zoom in on the model in the display.

## Developing
The project includes the complete bundle files you should not need to do anything to run it. However for development
you will need to retrieve the sources for the libraries used to do that run:
> `npm install`

This project uses esbuild to start this run:
> `npm run start:esbuild`
