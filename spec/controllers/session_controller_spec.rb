require 'rails_helper'

RSpec.describe SessionsController, type: :controller do

  let(:session) do
    Session.create!(
      semester: "Fall",
      year: 2017,
      start_date: "2017-09-01 00:00:00 UTC",
      end_date: "2017-12-31 00:00:00 UTC",
    )
  end

  describe "GET /sessions/" do
    context "when expected" do
      it "lists all sessions" do
        get :index
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when /sessions/{id} exists" do
      it "lists session with {id}" do
        get :show, params: {id: session[:id]}
        expect(response.status).to eq(200)
        expect(response.body).not_to be_empty
      end
    end

    context "when {id} is a non-existent id" do
      it "throws status 404" do
        get :show, params: {id: "poop"}
        expect(response.status).to eq(404)
      end
    end
  end

end
