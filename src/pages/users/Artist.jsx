import ArtistPanelWithSongs from "../../components/users/ArtistPanelWithSongs";
import { useParams, useLocation } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";

import { getById, save, deleteById } from "../../api";
import AsyncData from "../../components/AsyncData";
import { useAuth } from "../../contexts/Auth.context";
import useSWRMutation from "swr/mutation";
import { useCallback, useState, useEffect } from "react";

export default function Artist() {
  const { isAuthed, isArtist, isAdmin, user } = useAuth();
  const { pathname } = useLocation();
  const { id: urlId } = useParams();
  const [id, setId] = useState(urlId);
  const [isEditable, setIsEditable] = useState(false);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (
      pathname === "/artists/me" &&
      isAuthed &&
      (isArtist || isAdmin) &&
      user
    ) {
      setId(user.userId);
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [pathname, isAuthed, isArtist, isAdmin, user, setId, setIsEditable]);

  const {
    data: artistWithSongs = {},
    error: artistWithSongsError,
    isLoading: artistWithSongsLoading,
  } = useSWR(id ? [`users`, `${id}/songs`] : null, ([url, id]) =>
    getById(url, { arg: id })
  );

  const { trigger: updateUserTrigger, error: updateUserError } = useSWRMutation(
    "users",
    save
  );
  const { trigger: deleteSongTrigger, error: deleteSongError } = useSWRMutation(
    "songs",
    deleteById
  );

  const handleSave = useCallback(
    async (updateData) => {
      try {
        await updateUserTrigger({ id, ...updateData });
        mutate([`users`, `${id}/songs`]);
      } catch (error) {
        console.error("Updating user info failed", error);
      }
    },
    [updateUserTrigger, id, mutate]
  );

  const handleSongDelete = useCallback(
    async (songId) => {
      try {
        await deleteSongTrigger(songId);
        mutate([`users`, `${id}/songs`]);
      } catch (error) {
        console.error("Failed to delete song", error);
      }
    },
    [deleteSongTrigger, id, mutate]
  );

  return (
    <AsyncData
      loading={artistWithSongsLoading}
      error={artistWithSongsError || updateUserError || deleteSongError}
    >
      <ArtistPanelWithSongs
        artist={artistWithSongs.artist}
        totalSongs={artistWithSongs.totalSongs}
        songs={artistWithSongs.songs}
        isEditable={isEditable}
        onSave={handleSave}
        handleSongDelete={handleSongDelete}
      />
    </AsyncData>
  );
}
