namespace :db do
  namespace :seed do
    task chass: :environment do
      importer = ChassImporter.new("seeds/mock_chass")
      puts "Mock CHASS data import successful!"
    end
    task export: :environment do
      file = "seeds/export_data"
      exporter = ChassExporter.new(file)
      puts "Assignments have been exported to #{file}"
    end
  end
end
