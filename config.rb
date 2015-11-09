output_style = (environment == :production) ? :compressed : :expanded
preferred_syntax = :sass
relative_assets = true
line_comments = false
sourcemap = false
disable_warnings = false

http_path = (environment == :production) ? '/' : 'dist/'
css_dir = 'css'
css_path = 'dist/css'
sass_dir = 'sass'
images_dir = 'images'
images_path = 'dist/images'
generated_images_dir = 'images'
generated_images_path = 'dist/images'
javascripts_dir = 'js'
javascripts_path = 'dist/js'
fonts_dir = 'css/fonts'
fonts_path = 'dist/css/fonts'
http_fonts_dir = 'css/fonts'
http_fonts_path = 'css/fonts'
additional_import_paths = ['sass/','sass/']