import SongForm from "../../components/songs/SongForm";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { getById } from "../../api";
import AsyncData from "../../components/AsyncData";
import { useAuth } from "../../contexts/Auth.context";

export default function AddOrEditSong() {
  const { id } = useParams();
  const { user } = useAuth();

  const {
    data: song,
    error: songByIdError,
    isLoading,
  } = useSWR(id ? [`songs`, `${id}`] : null, ([url, id]) =>
    getById(url, { arg: id })
  );

  return (
    <AsyncData loading={isLoading} error={songByIdError}>
      <SongForm song={song?.artistId === user.userId ? song : null} />
    </AsyncData>
  );
}
