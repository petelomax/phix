-- ppm.e
global function read_ppm(sequence filename)
sequence image, line
integer dimx, dimy, maxcolor
atom fn = open(filename, "rb")
    if fn<0 then
        return -1 -- unable to open
    end if
    line = gets(fn)
    if line!="P6\n" then
        return -1 -- only ppm6 files are supported
    end if
    line = gets(fn)
    {{dimx,dimy}} = scanf(line,"%d %d%s")
    line = gets(fn)
    {{maxcolor}} = scanf(line,"%d%s")
    image = repeat(repeat(0,dimy),dimx)
    for y=1 to dimy do
        for x=1 to dimx do
            image[x][y] = getc(fn)*#10000 + getc(fn)*#100 + getc(fn)
        end for
    end for
    close(fn)
    return image
end function

global procedure write_ppm(sequence filename, sequence image)
integer fn,dimx,dimy
sequence colour_triple
    fn = open(filename,"wb")
    dimx = length(image)
    dimy = length(image[1])
    printf(fn, "P6\n%d %d\n255\n", {dimx,dimy})
    for y=1 to dimy do
        for x=1 to dimx do
            colour_triple = sq_div(sq_and_bits(image[x][y], {#FF0000,#FF00,#FF}),
                                                            {#010000,#0100,#01})
            puts(fn, colour_triple)
        end for
    end for
    close(fn)
end procedure

global function to_gray(sequence image)
sequence color
    for i=1 to length(image) do
        for j=1 to length(image[i]) do
            -- unpack color triple
            color = sq_div(sq_and_bits(image[i][j], {#FF0000,#FF00,#FF}),
                                                    {#010000,#0100,#01})
            image[i][j] = floor(0.2126*color[1] + 0.7152*color[2] + 0.0722*color[3])*#010101
        end for
    end for
    return image
end function

