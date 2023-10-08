import pg from 'pg';
import { getConditionQuery, getJoinTableOrConditionQuery, getJoinTwoTableConditionQuery } from './utils/index.js';
import { mapDBPlaylistsToModel, mapDBSongsToModel } from './utils/transform.js';

class PlaylistsService {
  constructor() {
    const { Pool } = pg;
    this._pool = new Pool();
    this._table = 'playlist_songs';
    this._tablePlaylist = 'playlists';
    this._tableSong = 'songs';
    this._tableUser = 'users';
    this._tableCollaboration = 'collaborations';
  }

  async getPlaylist(playlistId) {
    let query = getConditionQuery({id: playlistId}, [], this._tablePlaylist);
    const resultPlaylist = await this._pool.query(query);

    query = getJoinTwoTableConditionQuery(
      this._tableSong,
      this._table,
      'id',
      'song_id',
      ['id', 'title', 'performer'],
      ['playlist_id'],
      {},
      { playlist_id: playlistId },
    );
    const resultSongs = await this._pool.query(query);

    const data = {
      playlist: {
        ...resultPlaylist.rows.map(mapDBPlaylistsToModel)[0],
        songs: [],
      },
    };
    if (resultSongs.rows.length > 0) data.playlist.songs = resultSongs.rows.map(mapDBSongsToModel);

    return data;
  }
}

export default PlaylistsService;
