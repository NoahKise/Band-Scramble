# Band Scramble
#### *An anagram-based word game for music lovers.*

### Created By Noah Kise

A web app game where users are presented with scrambled letter tiles, and must figure out what musical artist the tiles can be rearranged to spell.

## To Do
* Remove genre selection page DONE
    * MainGame.jsx line 116 changing default state to true accomplishes this while leaving option for future implementation
* Add daily mode imageURL
* Remove audio hint button DONE
    * References to "hints" are audio hints
* Remove audio snippet from band bio DONE
* Make new instructional gifs
* Remove references to audio hints from help screen DONE
* Remove Discogs API DONE
    * New place for setBioArtistName (line 470)
    * New place for setImageUrl (line 472)
    * New place for setDiscogsBio (line 471)
    * Clean name function DONE
* Hard code artist images
* Hard code artist bios
* Remove Deezer API DONE
    * Remove references to setAudioPreviewUrl
    * Remove references to setAudioUnavailable