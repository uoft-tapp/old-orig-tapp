namespace :db do
  namespace :seed do
    task :chass, [:file]=>[:environment] do |t, args|
      importer = ChassImporter.new("seeds/#{args[:file].to_s}")
      puts "Mock CHASS data import successful!"
    end
  end
end
