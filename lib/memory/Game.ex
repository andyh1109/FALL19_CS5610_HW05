defmodule MemoryWeb.Game do
    

def new do
    %{
    tiles: Map.values(init_tiles()),
    clicks: 0,
    first: [],
    second: []
  }
  end

# initiate the list of tiles for memory game with letter, i, j, and hidden bool
def init_tiles() do
  # create a list of letters to be made into tiles, init empty list to add to
  pool = Enum.shuffle(["a", "b", "c", "d", "e", "f", "g", "h", "a", "b", "c",
                       "d", "e", "f", "g", "h"])
  tile_list = %{}
  # go through all 16 letters in the pool and create tiles with them
  # letter is the first random letter from pool, i and j are palcement in the
  # grid based on the modular division
  # hidden is to determine whether or not the letter for this tile is revealed

    tile_list
    |> Map.put(0, [Enum.at(pool, 0),
    0, # remainder should give the correct column
    0, # integer division should give the correct row
    true, # all tiles start hidden until clicked
    0])
    |> Map.put(1, [Enum.at(pool, 1),
    1,
    0,
    true,
    1])
    |> Map.put(2, [Enum.at(pool, 2),
    2,
    0,
    true,
    2])
    |> Map.put(3, [Enum.at(pool, 3),
    3,
    0,
    true,
    3])
    |> Map.put(4, [Enum.at(pool, 4),
    0,
    1,
    true,
    4])
    |> Map.put(5, [Enum.at(pool, 5),
    1,
    1,
    true,
    5])
    |> Map.put(6, [Enum.at(pool, 6),
    2,
    1,
    true,
    6])
    |> Map.put(7, [Enum.at(pool, 7),
    3,
    1,
    true,
    7])
    |> Map.put(8, [Enum.at(pool, 8),
    0,
    2,
    true,
    8])
    |> Map.put(9, [Enum.at(pool, 9),
    1,
    2,
    true,
    9])
    |> Map.put(10, [Enum.at(pool, 10),
    2,
    2,
    true,
    10])
    |> Map.put(11, [Enum.at(pool, 11),
    3,
    2,
    true,
    11])
    |> Map.put(12, [Enum.at(pool, 12),
    0,
    3,
    true,
    12])
    |> Map.put(13, [Enum.at(pool, 13),
    1,
    3,
    true,
    13])
    |> Map.put(14, [Enum.at(pool, 14),
    2,
    3,
    true,
    14])
    |> Map.put(15, [Enum.at(pool, 15),
    3,
    3,
    true,
    15])
end

# function to handle a letter being clicked
# either update the state to remember what has been clicked
# also need to update the click count
def on_click(tile, game) do
  # check if first || second is empty
  # converts to a list and checks length to see if first has been instantiated
  first_clicked = List.first(game.first) && true
  second_clicked = List.first(game.second) && true
  i = Enum.at(tile, 4)    # get the index to replace the tile

  # get the list of tiles and update it not to be hidden
  tile = List.replace_at(tile, 3, false)

  tile_list = game.tiles
  new_tiles = update_tiles(tile_list, tile)

  clicks = game.clicks + 1

  # first has not been clicked on yet
  if !first_clicked do
    game
    |> Map.put(:tiles, new_tiles)
    |> Map.put(:clicks, clicks)
    |> Map.put(:first, tile)

  else
    game
    |> Map.put(:tiles, new_tiles)
    |> Map.put(:clicks, clicks)
    |> Map.put(:second, tile)
  end
end

# replace the given tile with the one at its matched index in the list
def update_tiles(tile_list, tile) do

  i = Enum.at(tile, 4)

  # update the list with new tile
  tile_list = List.replace_at(tile_list, i, tile)
end

# update a tile to be hidden again in the event 2 clicked but not a match
def hide_tile(game, tile1, tile2) do

  tile1 = List.replace_at(tile1, 3, true)

  tile2 = List.replace_at(tile2, 3, true)

  tiles = game.tiles

  new_tiles = update_tiles(tiles, tile1)
  new_tiles = update_tiles(new_tiles, tile2)

  game = Map.put(game, :tiles, new_tiles)
end

# after 2 clicks have happened, need to forget what has been clicked
def reset_clicked(game) do
  game
  |> Map.put(:first, [])
  |> Map.put(:second, [])
end

# if not a match the tiles need to be re-hidden and the clicks forgotten
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