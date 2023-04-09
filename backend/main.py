import os
import re
from pathlib import Path
from webbrowser import get

from pytube import YouTube
import json
import zipfile

# API client library
import googleapiclient.discovery

# API information
api_service_name = "youtube"
api_version = "v3"
#Enter DEVELOPER_KEY
DEVELOPER_KEY = 'INSERT DEVELOPER KEY HERE'


# API client
youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=DEVELOPER_KEY)

#---------------------Downloading 1----------------------------
# check if video mp3 is already present, skip if yes.

def clean_saved_dir(dir):
    for f in os.listdir(dir):
        os.remove(os.path.join(dir, f))
    
    os.rmdir(dir)
    print(f"Removed all files from dir: {dir}")

def download_youtube_mp3_from_video_id(id, playlistId):
    base_url = 'https://www.youtube.com/watch?v='
    url = f'{base_url}{id}'
    yt = YouTube(url)
    status = yt.vid_info['playabilityStatus']['status']
    if status == "UNPLAYABLE":
        print(f"video_id {id} is not playable, cannot download.")
        return

    try: isinstance(yt.length, int)
    except:
        print(f"Could not get video length for {id}. Skipping download.")
        return

    # create condition - if the yt.length > 600 (10 mins), then don't download it
    if yt.length > 600:
        print(f"video_id {id} is longer than 10 minutes, will not download.")
        return

    video = yt.streams.filter(only_audio=True).first()

    try: song_title_raw = yt.title
    except:
        print(f'Unable to get title for id {id}. Skipping download.')
        return
    song_title = re.sub('\W+',' ', song_title_raw).lower().strip()
    song_path = f"{song_title}"

    download_path = f"saved_mp3s/{playlistId}/{song_path}"
    out_file = video.download(download_path)

    # save the file (which will be mp4 format)
    base, ext = os.path.splitext(out_file)
    new_file = base + '.mp3'
    os.rename(out_file, new_file)

    # move the mp3 to the root dir
    p = Path(new_file).absolute()
    parent_dir = p.parents[1]
    p.rename(parent_dir / p.name)

    # delete the child dir
    os.rmdir(download_path)

    # rename the mp3 to remove the bad chars
    source_name = f"saved_mp3s/{playlistId}/{song_title_raw}.mp3"
    dest_name = f"saved_mp3s/{playlistId}/{song_path}.mp3"
    try: os.rename(source_name,dest_name)
    except: print(f"Failed to rename the file: {song_title_raw}")



    # result of success
    print(f"{song_path} has been successfully downloaded. Video id: {id}")

#---------------------Downloading 2----------------------------    

# Request body (function = dynamic)
def get_playlist_items_json(playlistId):
    request = youtube.playlistItems().list(
        part="contentDetails",
        playlistId=playlistId,
        #maxResults=100
    )
    # Request execution
    response = request.execute()
    json_string = json.dumps(response, indent=6)
    # print(json_string)
    return json_string
    
def parse_ids_from_json(json_string):
    id_list = []
    d = json.loads(json_string)
    for i in d['items']:
        id = i['contentDetails']['videoId']
        id_list.append(id)
    return id_list

def manage_download_of_ids(video_ids, playlistId):
    for id in video_ids:
        try: download_youtube_mp3_from_video_id(id, playlistId)
        except: print(f'Failed to download video id: {id}')

def check_if_dir_exists(dir_path):
    dir_exists = os.path.isdir(dir_path)
    if not dir_exists:
        os.mkdir(path=dir_path)

def run(playlistId):
    output_dir = 'saved_mp3s/' + playlistId + "/"
    output_dir2 = 'saved_zips/'
    try:
        json_string = get_playlist_items_json(playlistId)
    except:
        raise Exception("Invalid playlist id")
    video_ids = parse_ids_from_json(json_string=json_string)
    check_if_dir_exists(dir_path=output_dir)
    check_if_dir_exists(dir_path=output_dir2)
    clean_saved_dir(dir=output_dir)
    manage_download_of_ids(video_ids, playlistId)
    zipp(playlistId)
    clean_saved_dir(dir=output_dir)

def zipp(playlistId):
    output_dir2 = 'saved_zips/'
    mp3path='saved_mp3s/' + playlistId + '/'
    with zipfile.ZipFile(output_dir2 + playlistId + '.zip', 'w') as myzip:
        for f in os.listdir(mp3path):
            myzip.write(os.path.join(mp3path, f), os.path.join('', f))
