### Readme (WIP)

# Youtube Playlist to MP3 Converter

## Description

YouTube has significantly more material than any streaming serice can currently offer. Content is regularly removed from Youtube, and that has personally affected me as I've lost music I'll never get to hear again. For this reason, I convert some content to MP3 format via 3rd party websites so I can have a personal copy to listen to. I've always been curious about the inner workings of these converters and also hesistant about viruses, etc. 
I created this project to automate a tedious task and further my own knowledge. Previously, converting my YouTube playlists to MP3 format was very inefficient. I would have to convert each video in my playlist individually. Now, I can simply provide this application the link to my playlist and it will handle everything. 

Note: Videos over 10 minutes long will not be converted. To update this to suit your needs, see 'yt.length' on "main.py" 

Note: Initial backend code was obtained from: https://github.com/vastevenson/python-youtube-mp3-downloader

<img width="1918" alt="image" src="https://user-images.githubusercontent.com/47201322/230751298-086b025d-1273-4418-b421-674687516afd.png">

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running.

1. Clone this repository. 
2. Open your terminal and create 2 instances/tabs. Navigate to the root directory, then "cd" into the client and backend folders respectively. 
3. In your backend terminal, create a virtual environment via "python3 -m venv venv", then activate via "source venv/bin/activate". Then run "python3 install -r requirements.txt". Finally, run "python3 server.py".
4. In your client terminal, run "npm install", then "npm start". 

## Usage

Provide instructions and examples for use. Include screenshots as needed.

To add a screenshot, create an `assets/images` folder in your repository and upload your screenshot to it. Then, using the relative filepath, add it to your README using the following syntax:

    ```md
    ![alt text](assets/images/screenshot.png)
    ```
    

## Credits

List your collaborators, if any, with links to their GitHub profiles.

If you used any third-party assets that require attribution, list the creators with links to their primary web presence in this section.

If you followed tutorials, include links to those here as well.

## License

The last section of a high-quality README file is the license. This lets other developers know what they can and cannot do with your project. If you need help choosing a license, refer to [https://choosealicense.com/](https://choosealicense.com/).

---
