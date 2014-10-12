# config valid only for Capistrano 3.1
#lock '3.2.0'

set :whenever_identifier, ->{ "#{fetch(:application)}_#{fetch(:stage)}" }
set :default_shell, "bash -l"

set :application, 'shapter_api'
set :repo_url, 'git@github.com:ShapterCrew/shapter.git'

set :user, 'ubuntu'
set :ssh_options,{
  forward_agent: true,
  port: 22,
  #verbose: :debug,
  user: fetch(:user),
}

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
 set :deploy_to, '/var/www/shapter_api'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
 set :linked_files, %w{config/mongoid.yml config/initializers/behave_io.rb config/initializers/secret_token.rb config/initializers/aws_credentials.rb FrontApp/src/app/config/config.js}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
 set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle FrontApp/node_modules FrontApp/vendor }

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence do
      # Your restart mechanism here, for example:
       execute :touch, release_path.join('tmp/restart.txt')
    end
  end


  desc "restart delayed_job daemon"
  task :delayed_jobs do
    on roles(:app) do
      within release_path do 
        with rails_env: :production do 
          execute :bundle, :exec, :"bin/delayed_job", :restart
        end
      end
    end
  end


  desc "build front app"
  task :build_front do 
    on roles(:web), in: :sequence  do 
      within release_path.join("FrontApp") do 
        execute "if test ! -d /usr/lib/node_modules/grunt-cli; then sudo npm install --quiet -g grunt-cli; false;fi"
        execute "if test ! -d /usr/lib/node_modules/karma; then sudo npm install --quiet -g karma bower; false;fi"
        execute "if test ! -d /usr/lib/node_modules/bower; then sudo npm install --quiet -g bower; false;fi"
        execute :sudo, :npm, :install
        execute :bower, :install
        execute :grunt, :deploy
      end
    end
  end

  before :publishing, :build_front
  after :publishing, :restart
  after :restart, :delayed_jobs

end
