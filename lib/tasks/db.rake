namespace :db do
  namespace :seed do
    task chass: :environment do
      importer = ChassImporter.new("seeds/mock_chass")
      puts "Mock CHASS data import successful!"
    end
    task :export, [:round_id]=> [:environment] do |t, args|
      file = "seeds/export_data"
      exporter = ChassExporter.new(file, args[:round_id])
      puts "Assignments have been exported to #{file}"
    end
  end
end
