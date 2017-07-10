namespace :db do
  namespace :seed do
    task chass: :environment do
      importer = ChassImporter.new("seeds/mock_chass")
      puts "Mock CHASS data import successful!"
    end
    task :export, [:round_id]=> [:environment] do |t, args|
      exporter = ChassExporter.new
      exporter.export(args[:round_id])
    end
  end
end
