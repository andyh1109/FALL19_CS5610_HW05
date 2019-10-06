defmodule MemoryWeb.Game do
    

def new do
    %{
    tiles: Map.values(init_tiles()),
    clicks: 0,
    first: [],
    second: []
  }
  end


def init_tiles() do
  allLetters = Enum.shuffle(["a", "b", "c", "d", "e", "f", "g", "h", "a", "b", "c",
                       "d", "e", "f", "g", "h"])
   
  tileList = for i <- 0..3, j <- 0..3, into: %{}, do: {i*4 + j, [Enum.at(allLetters, i*4 + j), j, i, true,i*4 + j]}
end


def on_click(tile, game) do
  isFirstClicked = List.first(game.first) 
  isSecondClicked = List.first(game.second)
  i = Enum.at(tile, 4) 

  tile = List.replace_at(tile, 3, false)

  tileList = game.tiles
  new_tiles = update_tiles(tileList, tile)
  clicks = game.clicks + 1

  cond do
  !isFirstClicked ->
    game
    |> Map.put(:tiles, new_tiles)
    |> Map.put(:clicks, clicks)
    |> Map.put(:first, tile)

  !isSecondClicked ->
    game
    |> Map.put(:tiles, new_tiles)
    |> Map.put(:clicks, clicks)
    |> Map.put(:second, tile)

    isFirstClicked && isSecondClicked ->
    game
  end
end


def update_tiles(tileList, tile) do

  i = Enum.at(tile, 4)

  tileList = List.replace_at(tileList, i, tile)
end

def hide_tile(game, tileFirst, tileSec) do

  tileFirst = List.replace_at(tileFirst, 3, true)
  tileSec = List.replace_at(tileSec, 3, true)
  tiles = game.tiles

  new_tiles = update_tiles(tiles, tileFirst)
  new_tiles = update_tiles(new_tiles, tileSec)

  game = Map.put(game, :tiles, new_tiles)
end

def reset_clicked(game) do
  game
  |> Map.put(:first, [])
  |> Map.put(:second, [])
end

def not_match(game) do
  game = hide_tile(game, game.first, game.second)
  game = reset_clicked(game)
end

def client_view(game) do
  %{
    tiles: game.tiles,
    clicks: game.clicks,
    first: game.first,
    second: game.second
  }
end

end