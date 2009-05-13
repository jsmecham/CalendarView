require 'rake'
require 'rake/packagetask'

CALENDARVIEW_VERSION  = '1.2'

task :default => [ :package ]

Rake::PackageTask.new('calendarview', CALENDARVIEW_VERSION) do |package|
  package.need_zip = true
  package.package_dir = 'releases'
  package.package_files.include(
    'javascripts/**',
    'stylesheets/**',
    'examples/**',
    'ChangeLog'
  )
end
